import express from "express";
import cors from "cors";
import SubCategory from "./models/SubCategory.js";
import Category from "./models/Category.js";
import Province from "./models/Province.js";
import District from "./models/District.js";
import City from "./models/City.js";
import multer from "multer";
import Upload from "./helpers/upload.js";
import Field from "./models/Field.js";

const app = express();
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
);
app.use(express.json());
const upload = multer({dest: "uploads/"});

// category
app.post("/category", upload.single("image"), Category.create)
app.post("/category/update", upload.single("image"), Category.patch)
app.get("/category/reorder", Category.reorder)
app.get("/category/status/:id/:status", Category.status)
app.get("/category", Category.get.all)
app.get("/category/:id", Category.get.one)
app.get("/category-image/:image", Upload.show)
app.delete("/category", Category.delete)

// sub category
app.post("/sub-category", SubCategory.create);
app.get("/sub-category", SubCategory.get.all);
app.get("/sub-category/:id", SubCategory.get.one);
app.delete("/sub-category", SubCategory.delete)
app.post("/sub-category/status", SubCategory.changeStatus);
app.post("/sub-category/update", SubCategory.patch);

// provinces
app.post("/province", Province.create)
app.get("/province", Province.get.all)
app.get("/province/:id", Province.get.one)
app.post("/province/update", Province.patch)

// districts
app.post("/district", District.create)
app.get("/district", District.get.all)
app.get("/district/:id", District.get.one)
app.post("/district/update", District.patch)

// cities
app.post("/city", City.create)
app.get("/city", City.get.all)
app.get("/city/:id", City.get.one)
app.post("/city/update", City.patch)

// fields
app.post("/field", Field.create)
app.get("/field", Field.get.all)
app.get("/field/:id", Field.get.one)
app.post("/field/update", Field.patch)
app.get("/field/status/:id/:status", Field.status)
app.get("/field/require/:id/:status", Field.require)

app.listen("8001", () => {
    console.log("connected!");
});
