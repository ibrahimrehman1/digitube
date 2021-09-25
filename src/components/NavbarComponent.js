import React from "react";
import Logo from "../logo2.png";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { useHistory, Link } from "react-router-dom";

function Navbar({ categories, remainCategories, username, dispatch }) {
  if (!username && localStorage.getItem("username")) {
    username = localStorage.getItem("username");
  }

  username = username == 1 ? "" : username;

  let val = [
    "fas fa-gamepad",
    "fas fa-theater-masks",
    "fas fa-mosque",
    "fas fa-video",
    "fas fa-guitar",
  ];
  let val2 = [
    "fas fa-crosshairs",
    "fas fa-atom",
    "far fa-surprise",
    "fas fa-camera",
    "fas fa-user-graduate",
  ];

  async function filterByCategory(category) {
    if (typeof dispatch == "function") {
      console.log(category);
      let val = await fetch(
        `http://localhost:5000/filter?category=${category}`
      );
      let data = await val.json();
      console.log("Data: ", data);
      dispatch({ type: "ASSIGNMENT", payload: data.result });
    } else {
      window.location.assign("http://localhost:3000/");
    }
  }

  const history = useHistory();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <a
        className="navbar-brand"
        href="#"
        onClick={() => window.location.assign("http://localhost:3000/")}
      >
        <img src={Logo} alt="Website Logo" />
        <h2
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginBottom: "0px",
            fontSize: "1.5rem"
          }}
        >
          DIGITUBE
        </h2>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a
              className="nav-link"
              href="#"
              onClick={() => window.location.assign("http://localhost:3000/")}
              style={{ textAlign: "center",  padding: "5px" }}
            >
              <i className="fas fa-home"></i> Home{" "}
              <span className="sr-only">(current)</span>
            </a>
          </li>
          {categories.map((category, index) => {
            return (
              <li className="nav-item" key={index}>
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => filterByCategory(category)}
                  style={{ textAlign: "center",  padding: "5px" }}
                >
                  <i className={val[index]}></i> {category}
                </a>
              </li>
            );
          })}
          <li className="nav-item dropanchor">
            <div className="dropdown dropdiv" style={{ flexDirection: "row", margin: "0px" }}>
              <a
                className="dropdown-toggle text-light show-more"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ fontWeight: "bold", marginRight: username ? "10px" : "0px"}}
              >
                 Show More
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {remainCategories.map((category, index) => {
                  return (
                    <a
                    className="dropdown-item"
                      href="#"
                      key={index}
                      onClick={() => filterByCategory(category)}
                      style={{ paddingLeft: "10px", fontSize: "1.2rem" }}
                    >
                      <i className={val2[index]}></i> {category}
                    </a>
                  );
                })}
              </div>
            </div>
          </li>
        </ul>
        <ul className="ol-list">
          {username ? (
            <>
              <li>
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn btn-success dropdown-toggle"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Your Account
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <Link
                      to={`/videoupload/${username}/${categories}/${remainCategories}/${dispatch}`}
                    >
                      <span className="dropdown-item" href="#">
                        Upload Video/Audio
                      </span>
                    </Link>
                    <Link 
                      to={`/userchannel/${username}/${categories}/${remainCategories}/${dispatch}`}
                    >
                      <span className="dropdown-item" href="#">
                        Visit Channel
                      </span>
                    </Link>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        localStorage.removeItem("userid");
                        localStorage.removeItem("username");
                        history.push("/");
                      }}
                    >
                      Signout
                    </a>
                  </div>
                </div>
              </li>
            </>
          ) : (
            <>
              <li data-toggle="modal" data-target="#exampleModalCenter2">
                <a
                  className="nav-link"
                  href="#"
                  style={{ textAlign: "center", padding: "0px", margin: "5px" }}
                >
                  <VpnKeyIcon style={{ verticalAlign: "bottom" }} /> Login
                </a>
              </li>
              <li data-toggle="modal" data-target="#exampleModalCenter">
                <a
                  className="nav-link"
                  href="#"
                  style={{ textAlign: "center", padding: "0px", margin: "5px" }}
                >
                  <LockOpenIcon style={{ verticalAlign: "bottom" }} /> Signup
                </a>
              </li>
            </>
          )}

          <div
            className="modal fade"
            id="exampleModalCenter"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3
                    className="modal-title"
                    id="exampleModalLongTitle"
                    style={{ margin: "auto" }}
                  >
                    Signup Form
                  </h3>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ marginLeft: "0px" }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form
                    target="_self"
                    action="http://localhost:5000/signup"
                    method="POST"
                  >
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputName">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputName"
                        placeholder="Ibrahim Rehman"
                        name="fullname"
                        required
                      />
                    </div>
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputEmail1">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="ibrahim@gmail.com"
                        name="email"
                        required
                      />
                    </div>
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputPassword1">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="123456"
                        name="password"
                        required
                      />
                    </div>
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputPassword2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        id="exampleInputPassword2"
                        placeholder="123456"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    <button
                      type="reset"
                      className="btn btn-primary"
                      style={{ marginLeft: "5px" }}
                    >
                      Reset
                    </button>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="exampleModalCenter2"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3
                    className="modal-title"
                    id="exampleModalLongTitle"
                    style={{ margin: "auto" }}
                  >
                    Login Form
                  </h3>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ marginLeft: "0px" }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form
                    action="http://localhost:5000/login"
                    method="POST"
                    target="_self"
                  >
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputEmail2">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        id="exampleInputEmail2"
                        aria-describedby="emailHelp"
                        placeholder="ibrahim@gmail.com"
                        name="email"
                      />
                    </div>
                    <div className="form-group text-left">
                      <label htmlFor="exampleInputPassword3">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        required
                        id="exampleInputPassword3"
                        placeholder="123456"
                        name="password"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    <button
                      type="reset"
                      className="btn btn-primary"
                      style={{ marginLeft: "5px" }}
                    >
                      Reset
                    </button>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </nav>
  );
}

export { Navbar };
