import express from "express";
import cors from "cors";
import SubCategory from "./models/SubCategory.js";
import Category from "./models/Category.js";
import multer from "multer";
import Upload from "./helpers/upload.js";

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

app.listen("8001", () => {
    console.log("connected!");
});
