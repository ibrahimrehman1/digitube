import React, { useEffect } from "react";
import { Navbar } from "./NavbarComponent";

function VideoUploadComponent({ match: { params } }) {
  let username = params.username;
  let categories = params.categories.split(",");
  let remainCategories = params.remaincategories.split(",");
  let dispatch = params.dispatch;
  // const [categories, setCategories] = useState([]);
  useEffect(()=>{
      document.querySelector("title").innerText = "Upload Video | Online Free Video Streaming Platform";
  //     async function fetchData(){
  //         let val = await fetch("http://localhost:5000/categories");
  //         let data = await val.json();

  //         setCategories(data.categories);
  //     }
  //     fetchData();
  }, [])

  return (
    <>
      <Navbar
        categories={categories}
        remainCategories={remainCategories}
        username={username}
        dispatch={dispatch}
      />
      <h1
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "40px",
          marginBottom: "0px",
        }}
      >
        Video/Audio Details
      </h1>
      <form
      className="video-upload-form"
        style={{ color: "black", padding: "4em", fontWeight: "bold" }}
        action="http://localhost:5000/video"
        method="POST"
        encType="multipart/form-data"
      >
        <div class="form-group">
          <label for="exampleInputEmail1">Title</label>
          <input
            type="text"
            class="form-control video-title"
            id="exampleInputEmail1"
            name="title"
            aria-describedby="emailHelp"
            placeholder="Enter Title"
          />
        </div>
        <div class="form-group">
          <label for="exampleFormControlSelect1">Select Category(ies)</label>
          <select
            class="form-control video-category"
            id="exampleFormControlSelect1"
            name="category"
            multiple
          >
            {categories.map((category, index) => {
              return (
                <option key={index} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
        </div>
        <div class="form-group">
          <label for="exampleFormControlSelect1">Select Video Quality (If Uploading Video)</label>
          <select
            class="form-control video-quality"
            id="exampleFormControlSelect1"
            name="quality"
          >
            <option value="144p">144p</option>
            <option value="240p">240p</option>
            <option value="360p">360p</option>
            <option value="480p">480p</option>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </div>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">Description</label>
          <textarea
            class="form-control video-description"
            id="exampleFormControlTextarea1"
            rows="9"
            name="description"
          ></textarea>
        </div>
        <br />
        <div class="form-group">
          <label for="exampleFormControlFile1">Upload Captions (Optional)</label>
          <input
            type="file"
            class="form-control-file"
            id="exampleFormControlFile1"
            name="video"
          />
        </div>
        <br />
        <div class="form-group">
          <label for="exampleFormControlFile1">Upload Video/Audio</label>
          <input
            type="file"
            class="form-control-file"
            id="exampleFormControlFile1"
            name="video"
          />
        </div>
        <br />
        <div class="form-group">
          <label for="exampleFormControlFile1">Upload Thumbnail</label>
          <input
            type="file"
            class="form-control-file thumbnail-image"
            id="exampleFormControlFile1"
            name="video"
          />
        </div>
        <input
          type="hidden"
          value={localStorage.getItem("userid")}
          name="userid"
        />
        <button
          type="submit"
          class="btn btn-primary"
          style={{ display: "block", margin: "auto" }}
        >
          Post Video/Audio
        </button>
      </form>
    </>
  );
}

export { VideoUploadComponent };
