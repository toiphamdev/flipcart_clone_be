const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");

const createCategory = (categories, parentId = null) => {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      type: cate.type,
      parentId: cate.parentId,
      children: createCategory(categories, cate._id),
    });
  }

  return categoryList;
};

exports.addCategory = (req, res) => {
  let categoryUrl;
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
  };
  if (req.file) {
    categoryUrl = process.env.API + "/public/" + req.file.filename;
    categoryObj.categoryImage = categoryUrl;
  }
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((err, cat) => {
    if (err)
      return res.status(400).json({
        error: err,
      });
    if (cat) {
      return res.status(201).json({ cat });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err)
      return res.status(400).json({
        error: err,
      });
    if (categories) {
      const categoryList = createCategory(categories);
      return res.status(200).json({ categoryList });
    }
  });
};

exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  if (name instanceof Array) {
    const updatedCategories = [];
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };
      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(201).json({ updatedCategories });
  } else {
    const category = {
      name,
      type,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(201).json({ updatedCategory });
  }
};

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deleteCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id });
    deleteCategories.push(deleteCategory);
  }
  if (deleteCategories.length === ids.length) {
    res.status(200).json({
      message: "Categories removed",
    });
  } else {
    res.status(400).json({
      message: "Something went wrong ...",
    });
  }
};
