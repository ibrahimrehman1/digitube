const express = require("express");
const cors = require("cors");
const {
  getCategories,
  postLogin,
  postSignup,
  postVideo,
  postUserVideos,
  getAllVideos,
  showVideo,
  filterVideos,
  getUser,
  postPlaylist,
  postComment,
  getComments,
  putLikeDislike,
  putViews,
  removefromplaylist,
  putCommentLikes

} = require("./controllers/controller");
const multer = require("multer");

let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/categories", getCategories);

app.post("/signup", postSignup);

app.post("/login", postLogin);

app.post("/playlist", postPlaylist);

app.put("/updatelikedislike", putLikeDislike);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let ext = file.mimetype.split("/")[1];
    console.log(ext);
    let dir =
      ext == "png" || ext == "jpg" || ext == "jpeg"
        ? "./public/thumbnails"
        : ext == "mp4" ? "./public/videos" : ext == "octet-stream" ? "./public/subtitles" : "./public/audios";
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

app.post("/video", upload.array("video", 3), postVideo);

app.post("/uservideos", postUserVideos);

app.get("/getvideos", getAllVideos);

app.get("/showvideo", showVideo);

app.get("/filter", filterVideos);

app.get("/getuser", getUser);

app.post("/postcomment", postComment);

app.get("/getcomments", getComments);

app.put("/updateviews", putViews)


app.delete("/removefromplaylist", removefromplaylist);

app.put("/commentlikes", putCommentLikes);


app.listen(5000, () => console.log("Server Running ..."));
