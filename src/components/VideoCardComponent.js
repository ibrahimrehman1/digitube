import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { red } from "@material-ui/core/colors";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "30%",
  },
  media: {
    height: "230px",
    fontSize: "30px",
    width: "100%",
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useModalStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

function VideoCardComponent({
  uri,
  title,
  description,
  uploaddate,
  user_id,
  username,
  categories,
  remainCategories,
  dispatch,
}) {
  const classes = useStyles();

  // const [expanded, setExpanded] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [userName, setUserName] = useState("R");

  username = username || 1;

  useEffect(() => {
    async function getUser() {
      let data2 = await fetch(
        `http://localhost:5000/getuser?userid=${user_id}`
      );
      let val2 = await data2.json();
      setUserName(val2.user[0].user_name);
    }
    getUser();
  }, []);

  let currentUser = localStorage.getItem("userid");
  const cardStyles = {
    backgroundColor: "white",
    color: "black",
    margin: "5px",
    marginTop: "20px",
    border: "1px solid black",
  };
  uploaddate =
    uploaddate.split(" ").slice(0, 2).join(" ") +
    ", ".concat(uploaddate.split(" ")[2]);

  const modalClasses = useModalStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={modalClasses.paper}>
      <h2 id="simple-modal-title">Add to Playlist</h2>
      <p id="simple-modal-description">
        <form
          target="_self"
          action={`http://localhost:5000/playlist?title=${title}&userid=${currentUser}`}
          method="POST"
        >
          <div class="form-group">
            <label for="exampleInputName">Playlist Name</label>
            <input
              type="text"
              class="form-control"
              id="exampleInputName"
              placeholder="Enter Playlist Name"
              name="playlistname"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary">
            Add to Playlist
          </button>
        </form>
      </p>
    </div>
  );

  return (
    <>
      <Card
        style={cardStyles}
        className="col-sm-5 col-md-4 p-0 cards"
      >
        <Link
          to={`/showvideo/${title}/${username}/${categories}/${remainCategories}/${dispatch}`}
        >
          <CardMedia
            className={classes.media}
            image={uri}
            title={title}
          />
        </Link>
        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            component="h6"
            style={{ padding: "10px", textAlign: "center",
            fontWeight: "bold",
            color: "black", fontSize: "1.2rem"}}
          >
            
              {title}
          </Typography>
        </CardContent>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {userName.charAt(0)}
            </Avatar>
          }
          action={
            currentUser ? (
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon style={{ color: "black" }} />
              </IconButton>
            ) : (
              ""
            )
          }

          className="my-card"
          subheader={uploaddate}
        />

        {currentUser ? (
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={function () {
                handleOpen();
                handleClose();
              }}
            >
              Add to Playlist
            </MenuItem>
            <Modal
              open={open}
              onClose={handleModalClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              {body}
            </Modal>
          </Menu>
        ) : (
          ""
        )}
      </Card>
    </>
  );
}

export { VideoCardComponent };
