import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Navbar } from "./NavbarComponent";
import { VideoCardComponent } from "./VideoCardComponent";

function UserChannelComponent({ match: { params } }) {
  let categories = params.categories.split(",");
  let remainCategories = params.remaincategories.split(",");
  let dispatch = params.dispatch;
  let history = useHistory();
  let userid = localStorage.getItem("userid");
  let username = localStorage.getItem("username");
  const [videosData, setVideosData] = useState("");
  const [playlist, setPlaylist] = useState([]);
  let url = [];
  useEffect(() => {
    document.title = "User Channel | Online Free Video Streaming Platform";
    async function fetchUserVideos() {
      let val = await fetch("http://localhost:5000/uservideos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid }),
      });
      let data = await val.json();
      console.log(data);
      let arr = [];
      let playlistData = data.playlist;
      playlistData.forEach((val, index)=>{
        // arr.push(val);
        val.videos = []
        val.videos.push({title: val.title})
        playlistData.forEach((val2, index2)=>{
          if (val.name === val2.name && index !== index2){
            val.videos.push({title: val2.title});
          }
          
        })
        arr.push(val);
      })


      
      const filteredArr = arr.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);


      console.log("VAL: ", filteredArr);
      
      if (!data.video || !data.video.length) {
        history.push("/videoupload");
      } else {
        setVideosData(data.video);
        localStorage.setItem("playlistVids", JSON.stringify(filteredArr));
        setPlaylist(filteredArr);
      }
    }
    fetchUserVideos();
  }, []);

  if (videosData) {
    videosData.forEach((val, index) => {
      url.push(
        encodeURIComponent(
          videosData[index].thumbnail_path.split("/").slice(2).join("/")
        )
      );
    });
  }

  return (
    <>
      <Navbar
        categories={categories}
        remainCategories={remainCategories}
        username={username}
        dispatch={dispatch}
      />
      <div style={{ padding: "2em" }}>
        <h1 style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
          <q>{username}'s Channel</q>
        </h1>
        {videosData.length ? (
          <div style={{ textAlign: "center" }}>
            <h1
              style={{ fontSize: "2rem", marginTop: "1.5em", color: "white", textDecoration: "underline" }}
            >
              Your Videos/Audios
            </h1>
            <section className="row video-section">
              {url.map((val, index) => {
                return (
                  <VideoCardComponent
                  key={index}
                    uri={"http://localhost:5000/" + url[index]}
                    title={videosData[index].title}
                    description={videosData[index].description}
                    uploaddate={videosData[index].upload_date}
                    user_id={userid}
                    categories={categories}
                    remainCategories={remainCategories}
                    dispatch={dispatch}
                  />
                );
              })}
            </section>
            <h1 style={{ fontSize: "2rem", marginTop: "2em", color: "white", textDecoration: "underline" }}>
              Your Playlists
            </h1>
            <section className="row video-section-2">
              {playlist && playlist.length ? (
                <>
                  {playlist.map((val, index) => {
                    return (
                      <div className="playlist-card" key={index}>
                        <h3 style={{fontSize: "2.5rem"}}>{val.name}</h3>
                        <h6 style={{marginTop: "20px"}}>No. of Videos: {val.no_of_videos}</h6>
                        <h6>Total Views: {val.total_views}</h6>
                          <Link style={{color: "white", border: "1px solid white", padding: ".6em", marginTop: "10px"}}
                            to={`/playlistvideos/${val.name}/${username}/${categories}/${remainCategories}/${dispatch}`}
                          >
                            View Playlist
                          </Link>
                      </div>
                    );
                  })}
                </>
              ) : (
                ""
              )}
            </section>
          </div>
        ) : (
          <div className="loader">Loading...</div>
        )}
      </div>
    </>
  );
}

export { UserChannelComponent };
