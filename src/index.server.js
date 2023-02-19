const express = require("express");
require("dotenv/config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialData = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoutes = require("./routes/admin/order.routes");

//mongodb conection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@cluster0.kqofl00.mongodb.net/${process.env.DB_NAME}`,
    {
      useNewURLParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database has been conected!");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser());
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialData);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoutes);

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "hello from server",
  });
});

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
