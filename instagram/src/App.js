import React, { useState } from 'react';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react/cjs/react.development';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import logo from './logo.PNG';
import plus from './plus.PNG';
import homeImg from './homeImg.PNG';
import reqsts from './reqsts.PNG';
import { getStorage, ref ,uploadString,uploadBytes,getDownloadURL} from "firebase/storage";
import { collection, addDoc,query,where,getDocs } from "firebase/firestore";
import db from "./firebase";
import {storage} from './firebase';
function App() {
  const [data, setData] = useState({
    username: "",
    password: ""
  })
  const [feed, setFeed] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userid,setUserid]=useState();
  const [dp,setDp]=useState();
  const [isLogged, setIsLogged] = useState(false);
  const [isEmptyFeed, setIsEmptyFeed] = useState(false);
  const [isSharePost, setIsSharePost] = useState(false);
  const [isFindUser, setIsFindUser] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    dp:""
  })
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isRequest, setIsRequest] = useState(false);
  const [isFeed, setIsFeed] = useState(false);
  const [requests, setRequests] = useState([]);
  // const [isFindUser,setIsFindUser]=useState(false);
  const [searchData, setSearchData] = useState({
    toBeFound: ""
  })
  const [searchResult, setSearchResult] = useState([]);
  const [post, setPost] = useState({
    username: "",
    caption: "",
    media: "",
    dp:""
  })
  function acceptRequest(profileName) {
    
    const url = "http://localhost:2498/acceptRequest";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "username": data.username,
        "toBeAccepted": profileName
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        fetchRequests(data.username);
        isRequest(false);
        isRequest(true);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  function fetchRequests(profileName) {
    const url = "http://localhost:2498/getRequests";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "username": profileName })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        console.log("below is requests list");
        setRequests(res);
        console.log(res);
        console.log(requests);
      })
      .catch(err => {
        console.log(err);
      })
  }
  function fetchFollowers(profileName) {
    const url = "http://localhost:2498/getFollowers";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "username": profileName })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        setFollowers(res);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  function fetchFollowings(profileName) {
    const url = "http://localhost:2498/getFollowings";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "username": profileName })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        setFollowings(res);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  function fetchPosts(profileName) {
    console.log(profileName);
    const url = "http://localhost:2498/fetchPostsOfUser";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "username": profileName })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        setUserPosts(res);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  const seeFollowers = (e) => {
    setShowFollowers(true);
    setShowFollowings(false);
  }
  const seeFollowings = (e) => {
    setShowFollowings(true);
    setShowFollowers(false);
  }
  const seeRequest = (e) => {
    //set section
    setIsRequest(true);
    setIsProfile(false);
    setIsFeed(false);
    setIsSharePost(false);
    setIsFindUser(false);
    setShowFollowers(false);
    setShowFollowings(false);
    fetchRequests(data.username);

  }
  function seeProfile(profileName) {
    //set section

    setIsProfile(true);
    setIsFeed(false);
    setIsSharePost(false);
    setIsFindUser(false);
    setShowFollowers(false);
    setShowFollowings(false);
    setIsRequest(false);

    const name = "username";
    const value = profileName;
    setProfileData(() => ({
      [name]: value
    }))
    fetchFollowers(profileName);
    fetchFollowings(profileName);
    fetchPosts(profileName);
  }
  const seeFeed = (e) => {
    //set section
    setIsFeed(true);
    setIsSharePost(false);
    setIsProfile(false);
    setIsFindUser(false);
    setIsRequest(false);
  }
  const wantToSharePost = (e) => {
    //set section
    setIsSharePost(true);
    setIsFeed(false);
    setIsProfile(false);
    setIsFindUser(false);
    setIsRequest(false);
  }
  const switchToLogin = () => {
    setIsNewUser(false);
  }
  const switchToSignin = () => {
    setIsNewUser(true);
  }
  const handleSearchChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // setIsFindUser(false);

    setSearchData((old) => ({
      ...old,
      [name]: value
    }))
    console.log(searchData);
    console.log("true");

  }
  const loadFile = function(event) {
    const image = document.getElementById('showoutput');
    image.src = URL.createObjectURL(event.target.files[0]);
  };
  const handleUploadChange = (e) => {

    const name = e.target.name;
    const value = e.target.value;
    setPost((old) => ({
      ...old,
      [name]: value
    }))
    
  }
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('media', file);
    fetch(`http://localhost:2498/media`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'multipart/form-data'
      },
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        let mediaLoc = res.slice(19);
        console.log(mediaLoc);
        setPost((old) => ({
          ...old,
          ['media']: mediaLoc
        }))
      }).catch(err => {
        console.log(err);
      })
      loadFile(e);
  }
  const handleSearchSubmit = (e) => {

    e.preventDefault();
    //set section
    setIsFeed(false);
    setIsRequest(false);
    setIsSharePost(false);
    setIsProfile(false);


    const url = "http://localhost:2498/findUser";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchData)
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res === "no") {
          alert("no user exist as per your search");
          console.log("no user exist as per your search");

        }
        else {
          // console.log(searchResult);
          // for(let i=0;i<res.length;i++){
          //   searchResult.push(res[i]);
          // }
          setSearchResult(res);
          console.log(searchResult);
          setIsFindUser(true);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  const followUser = (e) => {
    e.target.innerHTML="requested";
    console.log(post);
    const url = "http://localhost:2498/follow";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "username": data.username,
        "toBeFollowed": profileData.username
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res === "yes") {
          console.log("send them follow request successfully");
          setShowFollowings(false);
          setShowFollowings(true);
        } else {
          console.log("could not send follow request");
        }
      })
      .catch(err => {
        console.log(err);
      })

  }
  const handlePostUploadSubmit = (e) => {
    e.preventDefault();
    console.log(post);
    const url = "http://localhost:2498/post";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res === "yes") {
          console.log("sent successfully");
          setIsSharePost(false);
        } else {
          console.log("post can not sent");
          alert("an errr occured");
        }
      }).catch(err => {
        console.log(err);
      })
  }
  const handleChangeLogin = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((old) => ({
      ...old,
      [name]: value
    }))
    if (name === "username") {
      setPost((old) => ({
        ...old,
        [name]: value
      }))
      console.log(post);
    }
    console.log(data);
  }
  const fetchFeed = (e) => {
    const url = "http://localhost:2498/feed";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res === "no") {
          console.log("no feed");
          setIsEmptyFeed(true);
        }
        else {
          setFeed(res);
          console.log(feed);
        }

        //set section
        setIsLogged(true);
        setIsFeed(true);
        setIsSharePost(false);
        setIsProfile(false);
        setIsFindUser(false);
        setIsRequest(false);


      }).catch(err => {
        console.log(err);
      })
  }
  const submitSignIn = (e) => {
    e.preventDefault();
    const url = "http://localhost:2498/signin";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res === "yes") {
          fetchFeed();

        }
        else {
          alert('Please enter valid data');
        }
      }).catch(err => {
        console.log(err);
      })
  }
  const submitLogIn = (e) => {
    e.preventDefault();
    const url = "http://localhost:2498/login";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res === "yes") {
          fetchFeed();
        }
        else {
          alert('Please enter valid data');
        }
      }).catch(err => {
        console.log(err);
      })
  }
  return (
    <div className="App">
      {
        !isLogged ?
          <>
            {
              isNewUser ?
                <div className="container">
                  <div className="signinForm">
                    <img src={logo} className="logo" />
                    <h3 className="signinText">Sign up to see videos from your friends</h3>
                    <form onSubmit={submitSignIn}>
                      {console.log(logo)}
                      <input placeholder="Username" className="inpInSignIn" type="text" name="username" onChange={handleChangeLogin} />
                      <br />
                      <input placeholder="Password" type="password" className="inpInSignIn" name="password" onChange={handleChangeLogin} />
                      <br />
                      <button className="submitBtn" type="submit" >Sign Up</button>
                    </form>
                    <hr />
                    <hr />
                    <button className="switchBtn" onClick={switchToLogin}>Have an account? log in</button>
                  </div>
                </div> :
                <div className="container">
                  <div className="logInForm">
                    <img src={logo} className="logo" />
                    <form onSubmit={submitLogIn}>
                      <input placeholder="Username" className="inpInSignIn" type="text" name="username" onChange={handleChangeLogin} />
                      <input placeholder="Password" className="inpInSignIn" type="password" name="password" onChange={handleChangeLogin} />
                      <button className="submitBtn" type="submit" >Log in</button>
                    </form>
                    <hr />
                    <hr />
                    <button className="switchBtn" onClick={switchToSignin}>Don't have an account? Sign In</button>
                  </div>
                </div>
            }
          </> :
          <>
            <div className="container">
              <Navbar>
                <img src={logo} className="navLogo" />
                <form onSubmit={handleSearchSubmit}>
                  <input placeholder="Search" className="inpInSearch" type="text" name="toBeFound" value={searchData.toBeFound} onChange={(e) => {
                    handleSearchChange(e);
                  }}></input>
                  {/* <button type="submit" value="Seach" variant="secondary" >Search</button> */}
                </form>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <img src={homeImg} onClick={seeFeed}></img>
                <img src={reqsts} onClick={seeRequest}></img>
                <label for="postmedia" ><img onClick={wantToSharePost} src={plus}></img></label>
              </Navbar>
            </div>



            {
              (isRequest) ?
                <div className="container">
                  <div className="requests">
                  <div className="RequestHeading">Requests : </div>
                  {
                    requests.map((request) => {
                      return (
                        <div className="container">
                          <div className="request">
                          <span className="requestHolder">{request.username}</span>
                          &nbsp;
                          <button className="acceptButton" onClick={() => acceptRequest(request.username)}>accept</button>
                          </div>
                        </div>
                      )
                    })
                  }
                  </div>
                </div> :
                null
            }
            {
              (isFindUser) ?
                <div className="container">
                  <div className="usersList">
                    <div className="UserListHeading">Search Results : </div>
                    {
                      console.log(searchResult)
                    }
                    {
                      searchResult.map((postData) => {
                        return (
                          <div class="container">
                            <button className="searchResultUsername" onClick={() => seeProfile(postData)}>{postData}</button>
                          </div>
                        )
                      })
                    }
                  </div>
                </div> :
                null
            }
            {
              (isSharePost) ?
                <div className="container">
                  <div className="uploadPost">
                    <form onSubmit={handlePostUploadSubmit}>
                      <input className="hiddenClass" id="postmedia" type="file" accept="image/*,video/*" onChange={handleMediaChange}></input>
                      <img className="uploadedImage" id="showoutput" src={plus}></img>
                      <input className="inpCaption" placeholder="caption" type="text" name="caption" onChange={handleUploadChange}></input>
                      <br/>
                      <button className="uploadPostBtn" type="submit">Upload</button>

                    </form>
                  </div>
                </div> :
                null
            }

            {
              (isProfile) ?
                <>
                  <div className="container">
                    <div className="profile">
                      <span className="profileHolder"> {profileData.username}</span>
                      <div className="container">
                      {/* <div className="followSection"> */}
                        {console.log(followers.indexOf(data.username))}
                        {
                          ((-1 === followings.indexOf(data.username)) && (-1 === followers.indexOf(data.username)) && (data.username !== profileData.username)) ?
                            <button className="followButton" onClick={followUser} >follow</button>
                            : (
                              <>
                                {
                                  ((-1 !== followings.indexOf(data.username)) && (-1 === followers.indexOf(data.username)) && (data.username !== profileData.username)) ?
                                    <button className="followButton" onClick={followUser}>follow back</button>
                                    :
                                    ((data.username === profileData.username) ? null : null)
                                }
                              </>

                            )
                        }

                      {/* </div> */}
                      &nbsp;&nbsp;
                      <button className="profileFollowText" onClick={seeFollowers} >followers</button>
                      &nbsp;&nbsp;
                      <button className="profileFollowText" onClick={seeFollowings} >followings</button>
                      </div>
                      <br />

                      {
                        (showFollowers) ?
                          <div class="followers">
                            <>
                              <span className="follHead">followers : </span>
                              <br />
                              {
                                (followers.length > 0) ?
                                  (followers.map((user) => {
                                    return (
                                      <>
                                        <button className="follProfile" onClick={() => seeProfile(user)}>@{user}</button>
                                      </>
                                    )
                                  }))
                                  : null
                              }
                            </>
                          </div> :
                          null
                      }
                      {
                        (showFollowings) ?
                          <div className="container">
                            <div class="followings">
                              <span className="follHead">followings : </span>
                              <br />
                              {
                                (followings.length > 0) ?
                                  (followings.map((user) => {
                                    return (
                                      <>
                                        <button className="follProfile" onClick={() => seeProfile(user)}>@{user}</button>
                                      </>
                                    )
                                  }))
                                  : null
                              }
                            </div>
                          </div> :
                          null
                      }
                      <div class="container">
                        <div className="postHeadingProfiele"> posts by {profileData.username} :  </div>
                        {
                          userPosts.map((postData) => {
                            return (
                              <div className="container">
                                <div className="post">
                                  <div className="postHolder">{postData.username}</div>
                                  <hr />
                                  {
                                    (((postData.media).substr((postData.media).length - 3) === "png") || ((postData.media).substr((postData.media).length - 3) === "jpg")) ?
                                      <>
                                        <img src={`${postData.media}`} ></img>
                                      </> :
                                      <>
                                      </>
                                  }
                                  <hr />
                                  <div className="caption" >{postData.caption}</div>
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                </> :
                null
            }



            {
              (isFeed) ?

                (
                  <>
                    <div className="container">
                      <div className="feed">
                        {/* <h2>i am feed</h2> */}
                        {
                          (!isEmptyFeed) ?
                            <>
                              {
                                feed.map((postData) => {
                                  return (
                                    <div className="container">
                                      <div className="post">
                                        <div className="postHolder">{postData.username}</div>
                                        <hr />
                                        {
                                          (((postData.media).substr((postData.media).length - 3) === "png") || ((postData.media).substr((postData.media).length - 3) === "jpg")) ?
                                            <>
                                              <img className="postImage" src={postData.media} ></img>
                                            </> :
                                            <>
                                            </>
                                        }

                                        <hr />
                                        <div className="caption">{postData.caption}</div>
                                      </div>
                                    </div>
                                  )
                                })
                              }
                            </> :
                            <>
                              <h1>make friends to see their feeds</h1>
                            </>
                        }
                      </div>
                    </div>
                  </>
                ) :
                null
            }

          </>
      }
    </div>
  );
}

export default App;

// import React, { useState } from 'react';
// import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react/cjs/react.development';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button } from 'react-bootstrap';
// import { Navbar } from 'react-bootstrap';
// import logo from './logo.PNG';
// import plus from './plus.PNG';
// import homeImg from './homeImg.PNG';
// import reqsts from './reqsts.PNG';
// function App() {
//   const [data, setData] = useState({
//     username: "",
//     password: ""
//   })
//   const [feed, setFeed] = useState([]);
//   const [isNewUser, setIsNewUser] = useState(false);
//   const [isLogged, setIsLogged] = useState(false);
//   const [isEmptyFeed, setIsEmptyFeed] = useState(false);
//   const [isSharePost, setIsSharePost] = useState(false);
//   const [isFindUser, setIsFindUser] = useState(false);
//   const [isProfile, setIsProfile] = useState(false);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowings, setShowFollowings] = useState(false);
//   const [profileData, setProfileData] = useState({
//     username: ""
//   })
//   const [followers, setFollowers] = useState([]);
//   const [followings, setFollowings] = useState([]);
//   const [userPosts, setUserPosts] = useState([]);
//   const [isRequest, setIsRequest] = useState(false);
//   const [isFeed, setIsFeed] = useState(false);
//   const [requests, setRequests] = useState([]);
//   // const [isFindUser,setIsFindUser]=useState(false);
//   const [searchData, setSearchData] = useState({
//     toBeFound: ""
//   })
//   const [searchResult, setSearchResult] = useState([]);
//   const [post, setPost] = useState({
//     username: "",
//     caption: "",
//     media: ""
//   })
//   function acceptRequest(profileName) {
//     const url = "http://localhost:2498/acceptRequest";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "username": data.username,
//         "toBeAccepted": profileName
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         fetchRequests(data.username);
//         isRequest(false);
//         isRequest(true);
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   function fetchRequests(profileName) {
//     const url = "http://localhost:2498/getRequests";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ "username": profileName })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         console.log("below is requests list");
//         setRequests(res);
//         console.log(res);
//         console.log(requests);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   function fetchFollowers(profileName) {
//     const url = "http://localhost:2498/getFollowers";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ "username": profileName })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         setFollowers(res);
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   function fetchFollowings(profileName) {
//     const url = "http://localhost:2498/getFollowings";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ "username": profileName })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         setFollowings(res);
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   function fetchPosts(profileName) {
//     console.log(profileName);
//     const url = "http://localhost:2498/fetchPostsOfUser";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ "username": profileName })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         setUserPosts(res);
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   const seeFollowers = (e) => {
//     setShowFollowers(true);
//     setShowFollowings(false);
//   }
//   const seeFollowings = (e) => {
//     setShowFollowings(true);
//     setShowFollowers(false);
//   }
//   const seeRequest = (e) => {
//     //set section
//     setIsRequest(true);
//     setIsProfile(false);
//     setIsFeed(false);
//     setIsSharePost(false);
//     setIsFindUser(false);
//     setShowFollowers(false);
//     setShowFollowings(false);
//     fetchRequests(data.username);

//   }
//   function seeProfile(profileName) {
//     //set section

//     setIsProfile(true);
//     setIsFeed(false);
//     setIsSharePost(false);
//     setIsFindUser(false);
//     setShowFollowers(false);
//     setShowFollowings(false);
//     setIsRequest(false);

//     const name = "username";
//     const value = profileName;
//     setProfileData(() => ({
//       [name]: value
//     }))
//     fetchFollowers(profileName);
//     fetchFollowings(profileName);
//     fetchPosts(profileName);
//   }
//   const seeFeed = (e) => {
//     //set section
//     setIsFeed(true);
//     setIsSharePost(false);
//     setIsProfile(false);
//     setIsFindUser(false);
//     setIsRequest(false);
//   }
//   const wantToSharePost = (e) => {
//     //set section
//     setIsSharePost(true);
//     setIsFeed(false);
//     setIsProfile(false);
//     setIsFindUser(false);
//     setIsRequest(false);
//   }
//   const switchToLogin = () => {
//     setIsNewUser(false);
//   }
//   const switchToSignin = () => {
//     setIsNewUser(true);
//   }
//   const handleSearchChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     // setIsFindUser(false);

//     setSearchData((old) => ({
//       ...old,
//       [name]: value
//     }))
//     console.log(searchData);
//     console.log("true");

//   }
//   const loadFile = function(event) {
//     const image = document.getElementById('showoutput');
//     image.src = URL.createObjectURL(event.target.files[0]);
//   };
//   const handleUploadChange = (e) => {

//     const name = e.target.name;
//     const value = e.target.value;
//     setPost((old) => ({
//       ...old,
//       [name]: value
//     }))
    
//   }
//   const handleMediaChange = (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append('media', file);
//     fetch(`http://localhost:2498/media`, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Accept': 'multipart/form-data'
//       },
//     }).then(res => res.json())
//       .then(res => {
//         console.log(res);
//         let mediaLoc = res.slice(19);
//         console.log(mediaLoc);
//         setPost((old) => ({
//           ...old,
//           ['media']: mediaLoc
//         }))
//       }).catch(err => {
//         console.log(err);
//       })
//       loadFile(e);
//   }
//   const handleSearchSubmit = (e) => {

//     e.preventDefault();
//     //set section
//     setIsFeed(false);
//     setIsRequest(false);
//     setIsSharePost(false);
//     setIsProfile(false);


//     const url = "http://localhost:2498/findUser";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(searchData)
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res === "no") {
//           alert("no user exist as per your search");
//           console.log("no user exist as per your search");

//         }
//         else {
//           // console.log(searchResult);
//           // for(let i=0;i<res.length;i++){
//           //   searchResult.push(res[i]);
//           // }
//           setSearchResult(res);
//           console.log(searchResult);
//           setIsFindUser(true);
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   const followUser = (e) => {
//     e.target.innerHTML="requested";
//     console.log(post);
//     const url = "http://localhost:2498/follow";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "username": data.username,
//         "toBeFollowed": profileData.username
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res === "yes") {
//           console.log("send them follow request successfully");
//           setShowFollowings(false);
//           setShowFollowings(true);
//         } else {
//           console.log("could not send follow request");
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       })

//   }
//   const handlePostUploadSubmit = (e) => {
//     e.preventDefault();
//     console.log(post);
//     const url = "http://localhost:2498/post";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(post)
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res === "yes") {
//           console.log("sent successfully");
//           setIsSharePost(false);
//         } else {
//           console.log("post can not sent");
//           alert("an errr occured");
//         }
//       }).catch(err => {
//         console.log(err);
//       })
//   }
//   const handleChangeLogin = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setData((old) => ({
//       ...old,
//       [name]: value
//     }))
//     if (name === "username") {
//       setPost((old) => ({
//         ...old,
//         [name]: value
//       }))
//       console.log(post);
//     }
//     console.log(data);
//   }
//   const fetchFeed = (e) => {
//     const url = "http://localhost:2498/feed";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data)
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res === "no") {
//           console.log("no feed");
//           setIsEmptyFeed(true);
//         }
//         else {
//           setFeed(res);
//           console.log(feed);
//         }

//         //set section
//         setIsLogged(true);
//         setIsFeed(true);
//         setIsSharePost(false);
//         setIsProfile(false);
//         setIsFindUser(false);
//         setIsRequest(false);


//       }).catch(err => {
//         console.log(err);
//       })
//   }
//   const submitSignIn = (e) => {
//     e.preventDefault();
//     const url = "http://localhost:2498/signin";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data)
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res === "yes") {
//           fetchFeed();

//         }
//         else {
//           alert('Please enter valid data');
//         }
//       }).catch(err => {
//         console.log(err);
//       })
//   }
//   const submitLogIn = (e) => {
//     e.preventDefault();
//     const url = "http://localhost:2498/login";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data)
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res === "yes") {
//           fetchFeed();
//         }
//         else {
//           alert('Please enter valid data');
//         }
//       }).catch(err => {
//         console.log(err);
//       })
//   }
//   return (
//     <div className="App">
//       {
//         !isLogged ?
//           <>
//             {
//               isNewUser ?
//                 <div className="container">
//                   <div className="signinForm">
//                     <img src={logo} className="logo" />
//                     <h3 className="signinText">Sign up to see videos from your friends</h3>
//                     <form onSubmit={submitSignIn}>
//                       {console.log(logo)}
//                       <input placeholder="Username" className="inpInSignIn" type="text" name="username" onChange={handleChangeLogin} />
//                       <br />
//                       <input placeholder="Password" type="password" className="inpInSignIn" name="password" onChange={handleChangeLogin} />
//                       <br />
//                       <button className="submitBtn" type="submit" >Sign Up</button>
//                     </form>
//                     <hr />
//                     <hr />
//                     <button className="switchBtn" onClick={switchToLogin}>Have an account? log in</button>
//                   </div>
//                 </div> :
//                 <div className="container">
//                   <div className="logInForm">
//                     <img src={logo} className="logo" />
//                     <form onSubmit={submitLogIn}>
//                       <input placeholder="Username" className="inpInSignIn" type="text" name="username" onChange={handleChangeLogin} />
//                       <input placeholder="Password" className="inpInSignIn" type="password" name="password" onChange={handleChangeLogin} />
//                       <button className="submitBtn" type="submit" >Log in</button>
//                     </form>
//                     <hr />
//                     <hr />
//                     <button className="switchBtn" onClick={switchToSignin}>Don't have an account? Sign In</button>
//                   </div>
//                 </div>
//             }
//           </> :
//           <>
//             <div className="container">
//               <Navbar>
//                 <img src={logo} className="navLogo" />
//                 <form onSubmit={handleSearchSubmit}>
//                   <input placeholder="Search" className="inpInSearch" type="text" name="toBeFound" value={searchData.toBeFound} onChange={(e) => {
//                     handleSearchChange(e);
//                   }}></input>
//                   {/* <button type="submit" value="Seach" variant="secondary" >Search</button> */}
//                 </form>
//                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//                 <img src={homeImg} onClick={seeFeed}></img>
//                 <img src={reqsts} onClick={seeRequest}></img>
//                 <label for="postmedia" ><img onClick={wantToSharePost} src={plus}></img></label>
//               </Navbar>
//             </div>



//             {
//               (isRequest) ?
//                 <div className="container">
//                   <div className="requests">
//                   <div className="RequestHeading">Requests : </div>
//                   {
//                     requests.map((request) => {
//                       return (
//                         <div className="container">
//                           <div className="request">
//                           <span className="requestHolder">{request.username}</span>
//                           &nbsp;
//                           <button className="acceptButton" onClick={() => acceptRequest(request.username)}>accept</button>
//                           </div>
//                         </div>
//                       )
//                     })
//                   }
//                   </div>
//                 </div> :
//                 null
//             }
//             {
//               (isFindUser) ?
//                 <div className="container">
//                   <div className="usersList">
//                     <div className="UserListHeading">Search Results : </div>
//                     {
//                       console.log(searchResult)
//                     }
//                     {
//                       searchResult.map((postData) => {
//                         return (
//                           <div class="container">
//                             <button className="searchResultUsername" onClick={() => seeProfile(postData)}>{postData}</button>
//                           </div>
//                         )
//                       })
//                     }
//                   </div>
//                 </div> :
//                 null
//             }
//             {
//               (isSharePost) ?
//                 <div className="container">
//                   <div className="uploadPost">
//                     <form onSubmit={handlePostUploadSubmit}>
//                       <input className="hiddenClass" id="postmedia" type="file" accept="image/*,video/*" onChange={handleMediaChange}></input>
//                       <img className="uploadedImage" id="showoutput" src={plus}></img>
//                       <input className="inpCaption" placeholder="caption" type="text" name="caption" onChange={handleUploadChange}></input>
//                       <br/>
//                       <button className="uploadPostBtn" type="submit">Upload</button>

//                     </form>
//                   </div>
//                 </div> :
//                 null
//             }

//             {
//               (isProfile) ?
//                 <>
//                   <div className="container">
//                     <div className="profile">
//                       <span className="profileHolder"> {profileData.username}</span>
//                       <div className="container">
//                       {/* <div className="followSection"> */}
//                         {console.log(followers.indexOf(data.username))}
//                         {
//                           ((-1 === followings.indexOf(data.username)) && (-1 === followers.indexOf(data.username)) && (data.username !== profileData.username)) ?
//                             <button className="followButton" onClick={followUser} >follow</button>
//                             : (
//                               <>
//                                 {
//                                   ((-1 !== followings.indexOf(data.username)) && (-1 === followers.indexOf(data.username)) && (data.username !== profileData.username)) ?
//                                     <button className="followButton" onClick={followUser}>follow back</button>
//                                     :
//                                     ((data.username === profileData.username) ? null : null)
//                                 }
//                               </>

//                             )
//                         }

//                       {/* </div> */}
//                       &nbsp;&nbsp;
//                       <button className="profileFollowText" onClick={seeFollowers} >followers</button>
//                       &nbsp;&nbsp;
//                       <button className="profileFollowText" onClick={seeFollowings} >followings</button>
//                       </div>
//                       <br />

//                       {
//                         (showFollowers) ?
//                           <div class="followers">
//                             <>
//                               <span className="follHead">followers : </span>
//                               <br />
//                               {
//                                 (followers.length > 0) ?
//                                   (followers.map((user) => {
//                                     return (
//                                       <>
//                                         <button className="follProfile" onClick={() => seeProfile(user)}>@{user}</button>
//                                       </>
//                                     )
//                                   }))
//                                   : null
//                               }
//                             </>
//                           </div> :
//                           null
//                       }
//                       {
//                         (showFollowings) ?
//                           <div className="container">
//                             <div class="followings">
//                               <span className="follHead">followings : </span>
//                               <br />
//                               {
//                                 (followings.length > 0) ?
//                                   (followings.map((user) => {
//                                     return (
//                                       <>
//                                         <button className="follProfile" onClick={() => seeProfile(user)}>@{user}</button>
//                                       </>
//                                     )
//                                   }))
//                                   : null
//                               }
//                             </div>
//                           </div> :
//                           null
//                       }
//                       <div class="container">
//                         <div className="postHeadingProfiele"> posts by {profileData.username} :  </div>
//                         {
//                           userPosts.map((postData) => {
//                             return (
//                               <div className="container">
//                                 <div className="post">
//                                   <div className="postHolder">{postData.username}</div>
//                                   <hr />
//                                   {
//                                     (((postData.media).substr((postData.media).length - 3) === "png") || ((postData.media).substr((postData.media).length - 3) === "jpg")) ?
//                                       <>
//                                         <img src={`${postData.media}`} ></img>
//                                       </> :
//                                       <>
//                                       </>
//                                   }
//                                   <hr />
//                                   <div className="caption" >{postData.caption}</div>
//                                 </div>
//                               </div>
//                             )
//                           })
//                         }
//                       </div>
//                     </div>
//                   </div>
//                 </> :
//                 null
//             }



//             {
//               (isFeed) ?

//                 (
//                   <>
//                     <div className="container">
//                       <div className="feed">
//                         {/* <h2>i am feed</h2> */}
//                         {
//                           (!isEmptyFeed) ?
//                             <>
//                               {
//                                 feed.map((postData) => {
//                                   return (
//                                     <div className="container">
//                                       <div className="post">
//                                         <div className="postHolder">{postData.username}</div>
//                                         <hr />
//                                         {
//                                           (((postData.media).substr((postData.media).length - 3) === "png") || ((postData.media).substr((postData.media).length - 3) === "jpg")) ?
//                                             <>
//                                               <img className="postImage" src={postData.media} ></img>
//                                             </> :
//                                             <>
//                                             </>
//                                         }

//                                         <hr />
//                                         <div className="caption">{postData.caption}</div>
//                                       </div>
//                                     </div>
//                                   )
//                                 })
//                               }
//                             </> :
//                             <>
//                               <h1>make friends to see their feeds</h1>
//                             </>
//                         }
//                       </div>
//                     </div>
//                   </>
//                 ) :
//                 null
//             }

//           </>
//       }
//     </div>
//   );
// }

// export default App;