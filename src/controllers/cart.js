const Cart = require("../models/cart");

const runUpdate = (condition, updateData) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
};

exports.addItemToCart = (req, res) => {
  Cart.findOne({
    user: req.user._id,
  }).exec((err, cart) => {
    if (err)
      return res.status(400).json({
        error: err,
      });
    if (cart) {
      let promiseArr = [];
      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          condition = { user: req.user._id, "cartItems.product": product };
          update = {
            $set: {
              "cartItems.$": cartItem, //set product of cartItems
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        promiseArr.push(runUpdate(condition, update));
      });
      // Cart.findOneAndUpdate(condition, update).exec((error, _cart) => {
      //   if (error) return res.status(400).json({ error });
      //   if (_cart) {
      //     return res.status(201).json({ cart: _cart });
      //   }
      // });
      Promise.all(promiseArr)
        .then((response) => res.status(200).json({ response }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });
      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
          return res.status(201).json({ cart });
        }
      });
    }
  });
};

exports.getCartItems = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .populate("cartItems.product", "_id name price productPictures")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item) => {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            img: item.product.productPictures[0].img,
            qty: item.quantity,
          };
        });
        res.status(200).json({ cartItems, _id: cart._id });
      }
    });
};

exports.removeCartItem = (req, res) => {
  const { productId, cartId } = req.body.payload;
  if (productId && cartId) {
    Cart.updateOne(
      { user: req.user._id, _id: cartId },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) return res.status(202).json({ result });
    });
  }
};
