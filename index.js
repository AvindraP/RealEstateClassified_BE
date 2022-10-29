import express from "express";
import cors from "cors";
import SubCategory from "./models/SubCategory.js";
import multer from "multer";

const upload = multer({dest: "uploads/"});
const app = express();
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    })
);
app.use(express.json());

// sub category
app.post("/sub-category", SubCategory.create);
app.get("/sub-category", SubCategory.get.all);
app.get("/sub-category/:id", SubCategory.get.one);
app.delete("/sub-category", SubCategory.delete)

app.listen("8001", () => {
    console.log("connected!");
});
