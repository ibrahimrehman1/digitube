import React, { useEffect, useReducer, useState } from "react";
import { Navbar } from "./components/NavbarComponent";
import { SearchBar } from "./components/SearchBarComponent";
import { VideosComponent } from "./components/VideosComponent";
import { Route, Switch, useHistory } from "react-router-dom";
import { VideoUploadComponent } from "./components/VideoUploadComponent";
import { UserChannelComponent } from "./components/UserChannelComponent";
import { ShowVideoComponent } from "./components/ShowVideoComponent";
import { PlaylistVideos } from "./components/PlaylistVideosComponent";

export const initialState = {
  videosData: [],
};

export function filterReducer(state, action) {
  switch (action.type) {
    case "ASSIGNMENT":
      return { ...state, videosData: [...action.payload] };

    default:
      return state;
  }
}

function MainComponent({ location }) {
  let username = "";
  if (location.search) {
    if (!location.search.includes("message")) {
      // console.log(location.search);
      let usernameWithId = location.search.substring(1).split("=");
      let user = usernameWithId[1].split("&")[0];
      user = user.split(/(?=[A-Z])/).join(" ");

      let user_id = usernameWithId[2];
      localStorage.setItem("userid", user_id);
      localStorage.setItem("username", user);
    } else {
      console.log("Incorrect Email Password");
    }
  }
  const [categories, setCategories] = useState([]);
  const [remainCategories, setRemainCategories] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(false);
  useEffect(() => {
    document.querySelector("title").innerText =
      "Homepage | Online Free Video Streaming Platform";
    async function fetchData() {
      let val = await fetch("http://localhost:5000/categories");
      let data = await val.json();

      setCategories(data.categories.slice(0, 5));
      setRemainCategories(data.categories.slice(5, data.categories.length));
    }
    fetchData();
  }, []);

  // Fetching all Videos

  const [state, dispatch] = useReducer(filterReducer, initialState);
  let history = useHistory();

  let url = [];
  useEffect(() => {
    async function fetchUserVideos() {
      if (fetchStatus) {
        setFetchStatus(false);
      }
      let val = await fetch("http://localhost:5000/getvideos");
      let data = await val.json();

      let arr = [];
      data.forEach((val, index) => {
        val.categories = [];
        val.categories.push(val.category);
        data.forEach((val2, index2) => {
          if (val.title === val2.title && index !== index2) {
            val.categories.push(val2.category);
          }
        });
        arr.push(val);
      });

      arr = arr.reduce((acc, current) => {
        const x = acc.find((item) => item.title === current.title);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);


      if (!data.length) {
        history.push("/");
      } else {
        // console.log(data.result);
        setFetchStatus(true);
        dispatch({ type: "ASSIGNMENT", payload: data });
      }
    }
    fetchUserVideos();
  }, []);
  // console.log(state);
  if (state.videosData.length) {
    // console.log("State ForEach: ", state);
    state.videosData.forEach((val, index) => {
      url.push(
        encodeURIComponent(
          state.videosData[index].thumbnail_path.split("/").slice(2).join("/")
        )
      );
    });
    // console.log(url);
    localStorage.setItem("videos", JSON.stringify(state.videosData));
    localStorage.setItem("url", JSON.stringify(url));
  }

  return (
    <div
      className="container-fluid"
      style={{ paddingLeft: "0px", paddingRight: "0px" }}
    >
      <Navbar
        categories={categories}
        remainCategories={remainCategories}
        username={username}
        dispatch={dispatch}
      />
      <SearchBar dispatch={dispatch} />
      {state.videosData.length ? (
        <VideosComponent
          url={url}
          videosData={state.videosData}
          categories={categories}
          remainCategories={remainCategories}
          username={username}
          dispatch={dispatch}
        />
      ) : fetchStatus ? (
        <h3 className="notFound">No Videos Found!</h3>
      ) : (
        <div className="loader">Loading...</div>
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <Switch>
        <Route component={MainComponent} path="/" exact />
        <Route
          component={VideoUploadComponent}
          path="/videoupload/:username/:categories/:remaincategories/:dispatch"
          exact
        />
        <Route
          component={UserChannelComponent}
          path="/userchannel/:username/:categories/:remaincategories/:dispatch"
          exact
        />
        <Route
          component={ShowVideoComponent}
          path="/showvideo/:title/:username/:categories/:remaincategories/:dispatch"
          exact
        />
        <Route
          component={PlaylistVideos}
          path="/playlistvideos/:name/:username/:categories/:remaincategories/:dispatch"
          exact
        />
      </Switch>
      <footer className="footer">
        <div>
          <div className="social-icons-div">
            <h2>DIGITUBE</h2>
            <div className="social-icons">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-instagram"></i>{" "}
              <i className="fab fa-youtube"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>
          <ul className="support-footer">
            <li>Support</li>
            <li>Contact Us</li>
            <li>FAQ</li>
            <li>Downloads</li>
            <li>Locate a Dealer</li>
            <li>Product Registration</li>
            <li>Spare Parts</li>
          </ul>
          <ul className="support-footer">
            <li>Digitube</li>
            <li>About Digitube</li>
            <li>Digitube Design</li>
            <li>Careers</li>
            <li>Newsroom</li>
          </ul>
        </div>
        <div className="copyright-div">
          <h5>&copy; Copyright 2021 | All Rights Reserved</h5>
        </div>
      </footer>
    </>
  );
}

export default App;
