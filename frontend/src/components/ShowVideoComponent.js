import React, { useEffect, useState } from "react";
import { Navbar } from "./NavbarComponent";
import { Avatar } from "@material-ui/core";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

export function ShowVideoComponent({ match: { params }, location }) {
  const title = params.title;
  let categories = params.categories.split(",");
  let remainCategories = params.remaincategories.split(",");
  let dispatch = params.dispatch;
  let username = params.username;
  const [videoData, setVideoData] = useState([]);
  const [userName, setUserName] = useState("");
  const [videoComments, setVideoComments] = useState([]);
  const [videoLikes, setLikes] = useState(0);
  const [videoDislikes, setDislikes] = useState(0);
  // const [views, setViews] = useState(0);
  const [todayDate, setToday] = useState("");
  let url = "";
  const classes = useStyles();

  async function videoviews(e) {
    let videoViews = videoData[0].view_count + 1;
    await fetch("http://localhost:5000/updateviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        views: videoViews,
        title,
        category: videoData[0].category[0],
      }),
    });
    window.location.assign(location.pathname);

    // setViews(videoViews);
  }

  async function audioviews(e) {
    let videoViews = videoData[0].view_count + 1;
    await fetch("http://localhost:5000/updateviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        views: videoViews,
        title,
        category: videoData[0].category[0],
      }),
    });
    window.location.assign(location.pathname);
    // setViews(videoViews);
  }

  useEffect(() => {
    document.title = `${title} | ${userName}`;
    const fetchData = async () => {
      let data = await fetch(`http://localhost:5000/showvideo?title=${title}`);
      let val = await data.json();
      setVideoData(val.result);
      setLikes(val.result[0].likes);
      setDislikes(val.result[0].dislikes);
      // setViews(val.result[0].view_count);

      let data2 = await fetch(
        `http://localhost:5000/getuser?userid=${val.result[0].user_id}`
      );

      let val2 = await data2.json();
      setUserName(val2.user[0].user_name);
    };

    if (!videoData[0]) {
      fetchData();
    }
  }, [videoData, userName]);

  useEffect(() => {
    if (videoData[0]) {
      console.count("Event: ");
      fetchComments();
      let video = document.querySelector("video");
      let audio = document.querySelector("audio");
      if (video) {
        video.addEventListener("ended", videoviews);
      } else if (audio) {
        audio.addEventListener("ended", audioviews);
      }
    }
  }, [videoData]);

  const fetchComments = async () => {
    let data = await fetch(
      `http://localhost:5000/getcomments?title=${videoData[0].title}`
    );
    let comments = await data.json();
    setVideoComments(comments.result);
  };

  if (videoData.length) {
    url = encodeURIComponent(
      videoData[0].video_path.split("/").slice(2).join("/")
    );
  }

  async function addComment() {
    let comment_text = document.querySelector(".postComment").value;
    let time = new Date().toLocaleDateString();
    // console.log(comment_text);
    let newComments = videoComments.concat([
      { comment_text, time, likes: 0, user_name: username },
    ]);
    setVideoComments(newComments);
    await fetch("http://localhost:5000/postcomment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: {
          comment_text,
          time,
          title,
          user_id: localStorage.getItem("userid"),
        },
      }),
    });
  }

  async function updateLikeDislikes(label, status) {
    let likes = videoLikes;
    let dislikes = videoDislikes;
    if (label === "Like" && status) {
      likes += 1;
    } else if (label === "Dislike" && status) {
      dislikes += 1;
    } else if (label === "Like" && !status) {
      likes -= 1;
    } else if (label === "Dislike" && !status) {
      dislikes -= 1;
    }

    await fetch("http://localhost:5000/updatelikedislike", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        likes,
        dislikes,
        title,
      }),
    });

    setLikes(likes);

    setDislikes(dislikes);
  }

  function changeThumbColor(val, label) {
    if (!localStorage.getItem("username")) {
      return;
    }
    if (val.style.opacity === "0.6") {
      val.style.opacity = "1";
      updateLikeDislikes(label, true);
    } else {
      val.style.opacity = "0.6";
      updateLikeDislikes(label, false);
    }
  }

  async function updateCommentLikes(ID, count) {
    await fetch(`http://localhost:5000/commentlikes?id=${ID}&count=${count}`, {
      method: "PUT",
    });
  }

  function changeCommentThumbColor(val, commentID, count, index) {
    if (val.style.opacity === "0.6") {
      val.style.opacity = "1";
      updateCommentLikes(commentID, count);
      let newVideoComments = videoComments;
      newVideoComments[index].likes += 1;
      // console.log(newVideoComments);
      setVideoComments(newVideoComments);
    } else {
      val.style.opacity = "0.6";
    }
  }

  function parseDate(str) {
    var mdy = str.split("/");
    return new Date(mdy[2], mdy[0] - 1, mdy[1]);
  }

  function datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  if (!todayDate) {
    var todays = new Date();
    var dd = String(todays.getDate()).padStart(2, "0");
    var mm = String(todays.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = todays.getFullYear();

    todays = mm + "/" + dd + "/" + yyyy;
    setToday(todays);
  }

  return (
    <>
      <Navbar
        categories={categories}
        remainCategories={remainCategories}
        username={username}
        dispatch={dispatch}
      />
      {url ? (
        <div className="main-video-div">
          {url.split(".")[1] === "mp3" ? (
            <audio controls>
              <source
                src={"http://localhost:5000/" + url}
                type="audio/mp3"
              ></source>
            </audio>
          ) : (
            <video controls>
              <source src={"http://localhost:5000/" + url}></source>
              <track
                src={"http://localhost:5000/" + videoData[0].captions}
                kind="captions"
                srcLang="en"
                label="English"
              />
              Video Not Available
            </video>
          )}

          <h1 style={{ color: "black", marginTop: "30px", fontSize: "3rem" }}>
            {videoData[0].title}
          </h1>
          <div className="video-like-dislike">
            <span>{videoData[0].view_count} Views</span>
            <div>
              <a
                className="fas fa-thumbs-up"
                style={{ cursor: "pointer", color: "white", opacity: ".6" }}
                title="Like"
                onClick={(e) => {
                  changeThumbColor(e.target, "Like");
                }}
              >
                {videoLikes}
              </a>
              <a
                className="fas fa-thumbs-down"
                style={{ cursor: "pointer", color: "white", opacity: ".6" }}
                title="Dislike"
                onClick={(e) => changeThumbColor(e.target, "Dislike")}
              >
                {videoDislikes}
              </a>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}
          >
            <Avatar className={classes.orange}>{userName[0]}</Avatar>
            <h2 style={{ marginLeft: "10px" }}>{userName} Channel</h2>
          </div>

          <pre
            style={{ color: "black", marginTop: "10px", fontFamily: "Arial" }}
          >
            {videoData[0].description}
          </pre>

          {localStorage.getItem("username") ? (
            <div
              className="comment-div"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "50px",
              }}
            >
              <input
                type="text"
                className="postComment"
                placeholder="Add a public comment..."
              />
              <button
                type="button"
                onClick={addComment}
                style={{ color: "black", opacity: 1, backgroundColor: "white" }}
              >
                Comment
              </button>
              {videoComments.length ? (
                <ul className="comments-list">
                  {videoComments.map((val, index) => {
                    return (
                      <li key={index} style={{ color: "inherit" }}>
                        <div className="avatar-div">
                          <Avatar className={classes.orange}>
                            {userName[0]}
                          </Avatar>
                          {val.user_name === userName ? (
                            <p>
                              {val.user_name}{" "}
                              <span className="badge badge-danger">
                                Creator
                              </span>
                            </p>
                          ) : (
                            <p>{val.user_name}</p>
                          )}
                        </div>
                        <p>{val.comment_text}</p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <a
                            className="fas fa-thumbs-up comment-thumb"
                            style={{
                              cursor: "pointer",
                              color: "white",
                              opacity: ".6",
                            }}
                            title="Like"
                            onClick={(e) =>
                              changeCommentThumbColor(
                                e.target,
                                val.comment_id,
                                val.likes,
                                index
                              )
                            }
                          >
                            {val.likes}
                          </a>
                          <span style={{ opacity: ".6" }}>
                            {" "}
                            (
                            {datediff(
                              parseDate(val.time),
                              parseDate(todayDate)
                            ) === 0
                              ? "Today"
                              : datediff(
                                  parseDate(val.time),
                                  parseDate(todayDate)
                                ) + " day(s) ago"}
                            )
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
