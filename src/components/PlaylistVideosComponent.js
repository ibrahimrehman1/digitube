import React, { useEffect, useState } from "react";
import { Navbar } from "./NavbarComponent";
import { Link } from "react-router-dom";

export function PlaylistVideos({ match: { params } }) {
  let playlistName = params.name;
  const [status, setStatus] = useState(false);
  let categories = params.categories.split(",");
  let remainCategories = params.remaincategories.split(",");
  let dispatch = params.dispatch;
  let username = params.username;
  const videos = JSON.parse(localStorage.getItem("videos"));
  let url = JSON.parse(localStorage.getItem("url"));
  const playlists = JSON.parse(localStorage.getItem("playlistVids"));
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filteredURL, setFilteredURL] = useState([]);
  useEffect(() => {
    document.title = "Playlist Videos | Online Free Video Streaming Platform";
    let currentPlaylist = playlists.filter((val, index) => {
      if (val.name === playlistName) {
        return true;
      }
      return false;
    });

    setCurrentPlaylist(currentPlaylist);
  }, []);
  if (currentPlaylist[0] && !filteredVideos.length && !status) {
    let newurl = [];
    let filteredVids = videos.filter((val, index) => {
      var video;
      currentPlaylist[0].videos.forEach((val2) => {
        if (val.title === val2.title) {
          video = val;
        }
      });
      if (video) {
        newurl.push(url[index]);
        return true;
      }
      return false;
    });
    
    setFilteredVideos(filteredVids);
    setFilteredURL(newurl);
  }

  function deleteVid(index) {
    if (filteredVideos.length !== 1) {
      var newVids = filteredVideos.filter((val, index2) => {
        if (index2 !== index) {
          return true;
        }
        let url = `http://localhost:5000/removefromplaylist?title=${val.title}&name=${currentPlaylist[0].name}&num=${filteredVideos.length}`;
        fetch(url, {
          method: "DELETE",
        })
          .then((val) => val.json())
          .then((data) => console.log(data));
        return false;
      });

      setFilteredVideos(newVids);
    } else {
      let url = `http://localhost:5000/removefromplaylist?title=${filteredVideos[index].title}&name=${currentPlaylist[0].name}&num=${filteredVideos.length}`;
      fetch(url, {
        method: "DELETE",
      })
        .then((val) => val.json())
      setStatus(true);
      setFilteredVideos([]);
    }
    let arr = filteredURL;
    if (index > -1) {
      arr.splice(index, 1);
    }

    setFilteredURL(arr);
  }
  return (
    <>
      <Navbar
        categories={categories}
        remainCategories={remainCategories}
        username={username}
        dispatch={dispatch}
      />
      <div className="playlist-vids">
        <h1>Playlist Videos/Audios</h1>
        {filteredVideos.length &&
          filteredVideos.map((val, index) => {
            return (
              <div key={index} className="img-tile">
                <div>
                  <Link
                    to={`/showvideo/${val.title}/${username}/${categories}/${remainCategories}/${dispatch}`}
                  >
                    <img
                      src={"http://localhost:5000/" + filteredURL[index]}
                      width="200"
                      height="150"
                      alt={val.title}
                      title={val.title}
                    />
                  </Link>
                  <div style={{ marginLeft: "20px" }}>
                    <h2>{val.title}</h2>
                    <h6>{val.description}</h6>
                    <span>{val.view_count} Views</span>
                  </div>
                </div>

                <div className="trash-div">
                  <a
                    className="fas fa-trash"
                    title="Remove From Playlist"
                    href="#"
                    onClick={() => deleteVid(index)}
                  > </a>
                </div>
              </div>
            );
          })}
      </div>
      {/* <VideosComponent url={filteredURL} videosData={filteredVideos} categories={categories} remainCategories={remainCategories} dispatch={dispatch}/> */}
    </>
  );
}
