import fs from "fs";
import path from "path";

const Upload = {
	image(image, callBack) {
		const imagePath = "uploads/images/";
		const targetPath = imagePath + image.originalname;
		const src = fs.createReadStream(image.path);
		const dest = fs.createWriteStream(targetPath);
		src.pipe(dest);
		src.on("end", function () {
			const fileName =
				new Date().getTime() + path.extname(image.originalname);
			fs.renameSync(targetPath, imagePath + fileName);
			callBack(fileName);
		});
	},

	images(images, defaultPath, callBack) {
		const imagePath = "uploads/images/";
		if (images.length > 0) {
			const fileNames = [];
			images.forEach((image) => {
				const targetPath = imagePath + image.originalname;
				const src = fs.createReadStream(image.path);
				const dest = fs.createWriteStream(targetPath);
				src.pipe(dest);
				src.on("end", function () {
					const fileName =
						new Date().getTime() + path.extname(image.originalname);
					fs.renameSync(targetPath, imagePath + fileName);
					fileNames.push(defaultPath + fileName);
					callBack(fileNames);
				});
			});
		}
	},

	show(req, res) {
		const path = process.cwd() + "/uploads/images/" + req.params.image;

		fs.readFile(
			path,

			function (err, image) {
				if (err) {
					throw err;
				}
				res.setHeader("Content-Type", "image/*");
				res.setHeader("Content-Length", ""); // Image size here
				res.setHeader("Access-Control-Allow-Origin", "*"); // If needs to be public
				res.send(image);
			}
		);
	},
};

export default Upload;
