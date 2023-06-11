import React, { useEffect, useReducer, useState } from "react";

import { Route, Switch, useHistory } from "react-router-dom";
import { VideoUploadComponent } from "./components/VideoUploadComponent";
import { UserChannelComponent } from "./components/UserChannelComponent";
import { ShowVideoComponent } from "./components/ShowVideoComponent";
import { PlaylistVideos } from "./components/PlaylistVideosComponent";
import MainComponent from "./components/MainComponent";

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
