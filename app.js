// npm install express multer webp-converter ejs

const express = require("express");

const multer = require("multer");

const webp = require("webp-converter");

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");

app.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) throw err;

    console.log(req.file.path);

    var output_path = Date.now() + "result.jpg";

    // var output_path = Date.now() + "result.webp"; for reverse conversion

    const result = webp.cwebp(req.file.path, output_path, "-q 80");
    // const result = webp.cwebp(req.file.path, output_path, "-o");  for reverse conversion

    result.then((response) => {
      res.download(output_path);
    });
  });
});

app.listen(4000, () => {
  console.log("App is listening on Port 4000");
});
