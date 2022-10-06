import express from "express";
import cors from "cors";
import OTP from "./models/OTP.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import SubCategory from "./models/SubCategory.js";
import Add from "./models/Add.js";
import City from "./models/City.js";
import Country from "./models/Country.js";
import District from "./models/District.js";
import Field from "./models/Field.js";
import Advertiser from "./models/Advertiser.js";
import Auth from "./models/Auth.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//login
app.post("/login", (req, res) => {
  Auth.login(req, res);
});
// user
app.post("/user", (req, res) => {
  User.create(req, res);
});

// otp verification
app.get("/verify", (req, res) => {
  OTP.verify(res, req);
});

// category
app.post("/category", (req, res) => {
  Category.create(req, res);
});
app.get("/category", (req, res) => {
  Category.get(req, res);
});
app.post("/category/update", (req, res) => {
  Category.update(req, res);
});
app.get("/category/block", (req, res) => {
  Category.block(req, res);
});
app.get("/category/active", (req, res) => {
  Category.active(req, res);
});
app.post("/category/upload", upload.single("icon"), function (req, res, next) {
  Category.iconUpload(req, res);
});

// sub category
app.post("/sub-category", (req, res) => {
  SubCategory.create(req, res);
});
app.get("/sub-category", (req, res) => {
  SubCategory.get(req, res);
});
app.post("/sub-category/update", (req, res) => {
  SubCategory.update(req, res);
});
app.get("/sub-category/block", (req, res) => {
  SubCategory.block(req, res);
});
app.get("/sub-category/active", (req, res) => {
  SubCategory.active(req, res);
});

// adds
app.get("/add", (req, res) => {
  Add.get(req, res);
});
app.post("/add", (req, res) => {
  Add.insert(req, res);
});
app.post("/add/update", (req, res) => {
  Add.update(req, res);
});
app.get("/top/add", (req, res) => {
  Add.top(req, res);
});
app.get("/remove-top/add", (req, res) => {
  Add.removeTop(req, res);
});
app.get("/sold/add", (req, res) => {
  Add.sold(req, res);
});
app.get("/delete/add", (req, res) => {
  Add.remove(req, res);
});
app.get("/add/publish", (req, res) => {
  Add.publish(req, res);
});

// cities
app.get("/city", (req, res) => {
  City.get(req, res);
});
app.post("/city", (req, res) => {
  City.insert(req, res);
});
app.post("/city/update", (req, res) => {
  City.update(req, res);
});

// countries
app.get("/country", (req, res) => {
  Country.get(req, res);
});
app.post("/country", (req, res) => {
  Country.insert(req, res);
});
app.post("/country/update", (req, res) => {
  Country.update(req, res);
});
app.get("/country/block", (req, res) => {
  Country.block(req, res);
});
app.get("/country/active", (req, res) => {
  Country.active(req, res);
});

// districts
app.get("/district", (req, res) => {
  District.get(req, res);
});
app.post("/district", (req, res) => {
  District.insert(req, res);
});
app.post("/district/update", (req, res) => {
  District.update(req, res);
});

// fields
app.get("/field", (req, res) => {
  Field.get(req, res);
});
app.post("/field", (req, res) => {
  Field.insert(req, res);
});
app.post("/field/update", (req, res) => {
  Field.update(req, res);
});
app.get("/field/block", (req, res) => {
  Field.block(req, res);
});
app.get("/field/active", (req, res) => {
  Field.active(req, res);
});

// advertiser
app.get("/advertiser", (req, res) => {
  Advertiser.get(req, res);
});
app.post("/advertiser/update", (req, res) => {
  Advertiser.update(req, res);
});
app.get("/advertiser/block", (req, res) => {
  Advertiser.block(req, res);
});
app.get("/advertiser/active", (req, res) => {
  Advertiser.active(req, res);
});
app.get("/advertiser/premium", (req, res) => {
  Advertiser.premium(req, res);
});
app.get("/advertiser/normal-user", (req, res) => {
  Advertiser.normalUser(req, res);
});

// dashboard
app.get("/add/total", (req, res) => {
  Add.total.all(req, res);
});
app.get("/add/total/active", (req, res) => {
  Add.total.active(req, res);
});
app.get("/add/total/pending", (req, res) => {
  Add.total.pending(req, res);
});

app.get("/advertiser/total", (req, res) => {
  Advertiser.total.normal(req, res);
});
app.get("/advertiser/total/premium", (req, res) => {
  Advertiser.total.premium(req, res);
});
app.get("/add/total/last-seven-days", (req, res) => {
  Add.lastSevenDays.post(req, res);
});
app.get("/add/total/last-seven-days/sold", (req, res) => {
  Add.lastSevenDays.sold(req, res);
});
app.get("/add/total/last-one-day", (req, res) => {
  Add.lastOneDay.post(req, res);
});
app.get("/add/total/last-one-day/sold", (req, res) => {
  Add.lastOneDay.sold(req, res);
});
app.get("/add/total/active", (req, res) => {
  Add.totalActive(req, res);
});

app.listen("8001", () => {
  console.log("connected!");
});
