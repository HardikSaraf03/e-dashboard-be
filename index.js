import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db/config.js";
import * as jwt from "jsonwebtoken";
import { productModel, userModel } from "./models/index.js";

dotenv.config();

const app = express();
const JWT_KEY = process.env.JWT_KEY || "";
const port = process.env.port || 4000;

app.use(cors());
app.use(express.json());

console.log(process.env.JWT_KEY);

const auth = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, JWT_KEY, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please provide valid auth token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please provide auth token" });
  }
};

// Register API
app.post("/register", async (req, res) => {
  console.log(req.body);
  let user = userModel(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  const token = jwt.sign({ result }, JWT_KEY, {
    expiresIn: "1d",
  });
  console.log({ result, auth: token });
  if (token) {
    res.send({ result, auth: token });
  } else {
    res.send({ result: "Something went wrong" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    console.log(user);
    if (user) {
      const token = jwt.sign({ user }, JWT_KEY, {
        expiresIn: "1d",
      });
      console.log(user, token);
      if (token) {
        res.send({ user, auth: token });
      } else {
        res.send({ result: "Something went wrong" });
      }
    } else {
      res.send({ result: "No user found" });
    }
  }
});

// Add product API
app.post("/add-product", auth, async (req, res) => {
  let product = new productModel(req.body);
  let result = await product.save();
  res.send(result);
});

// Get all products API
app.get("/products", auth, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No product found" });
  }
});

// Delete product API
app.delete("/product/:_id", auth, async (req, res) => {
  console.log(req.params);
  let data = await Product.deleteOne(req.params);
  res.send(data);
});

// Get product by id API
app.get("/product/:_id", auth, async (req, res) => {
  console.log(req.params);
  let data = await Product.findOne(req.params);
  if (data) {
    res.send(data);
  } else {
    res.send({ message: "No result found" });
  }
});

// Update product by id API
app.put("/product/:_id", auth, async (req, res) => {
  console.log(req.params);
  let data = await Product.updateOne(req.params, {
    $set: req.body,
  });
  if (data) {
    res.send(data);
  } else {
    res.send({ message: "No result found" });
  }
});

// Search product by id API
app.get("/search/:key", auth, async (req, res) => {
  console.log(req.params);
  let data = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
    ],
  });
  res.send(data);
});

app.listen(port, () => {
  dbConnection();
  console.log(`Server listening at http://localhost:${port}`);
});
