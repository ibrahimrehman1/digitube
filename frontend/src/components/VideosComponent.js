import React from "react";
import { VideoCardComponent } from "./VideoCardComponent";

function VideosComponent({
  url,
  videosData,
  categories,
  remainCategories,
  dispatch,
  username,
}) {
  if (!username && localStorage.getItem("username")) {
    username = localStorage.getItem("username");
  }
  if (!videosData) {
    videosData = [];
  }

  return (
    <article style={{ marginTop: "70px" }}>
      {" "}
      {videosData.length ? (
        <>
          <section className="video-section row">
            {" "}
            {url.map((val, index) => {
              return (
                <VideoCardComponent
                  key={index}
                  uri={"http://localhost:5000/" + url[index]}
                  title={videosData[index].title}
                  description={videosData[index].description}
                  uploaddate={videosData[index].upload_date}
                  user_id={videosData[index].user_id}
                  categories={categories}
                  remainCategories={remainCategories}
                  username={username}
                  dispatch={dispatch}
                />
              );
            })}{" "}
          </section>{" "}
        </>
      ) : (
        ""
      )}{" "}
    </article>
  );
}

export { VideosComponent };
