/*
Introduction:
Common stuff which we need to include every time when we are going to create 
our own new project , so just need to copy from here.../okay

commands:
npm install express mysql multer cors body-parser
*/

/*
phase:1
---------------------------------
declaration and importing modules 
---------------------------------
*/
const express=require('express');
const app=express();
const mysql=require('mysql');
const multer=require('multer');
const cors=require('cors');
const bodyParser=require('body-parser');
const urlencodeParser=bodyParser.urlencoded({extended:false});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true,
}));
app.use(cors({
	origin:true,
	methods:["GET","POST"],
	credentials:true,

}));
const storage=multer.diskStorage({
	destination:(req,file,cb)=>{
		cb(null,"./");
	},
	filename:function(req,file,cb){
		const ext=file.mimetype.split("/")[1];
		const d=new Date();
		const nowTime=d.getHours()+'_'+d.getMinutes()+'_'+d.getSeconds();
		const nowDate=d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+nowTime;
		
		cb(null,`../instagram/public/uploads/${file.originalname}-${nowDate}.${ext}`);
	}
});
const upload=multer({
	storage:storage
});

/*completed importing modules*/
/*phase 1 finished */

/* now going towards building actual application */


/*
__  		___________	   __________    __________    ___   __
||         | _________ |  | _________|  |____  ____|  |   \  | |
||         ||		  ||  ||	 ____ 		 ||		  | |\ \ | |
||         ||		  ||  ||	|___ |       ||       | | \ \| |
||_______  ||_________||  ||________||   ____||_____  | |  \   |
|________| |___________|  |__________|  |___________| |_|   \__|

/*

phase:2 User regestration

*/

/* USER LOGIN (for existing user validation) */

app.post("/login",(req,res)=>{
	const username=req.body.username;
	const conToFindInUserList=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:"instagram"
	})
	conToFindInUserList.query(`SELECT * FROM users WHERE username='${username}'`,(err,result)=>{
		var msg="fake message hihhihihihi";
		console.log(result);
		if(err){
			console.log("no user exists named this");
			msg="no";
			
		}
		else{
			try{
				console.log(result[0].username);
				if(result[0].username==username){
					console.log("found user named this in users list of instagram");
					msg="yes";
				}
			}
			catch(err){
				console.log("no user exists named this");
				msg="no";
			}
		}

		
		res.json(`${msg}`);
	})
})

/*login phase finished */


/* ============================================================= */


/* USER SIGNIN (for new user validation) */


app.post("/signin",(req,res)=>{
	const username=req.body.username;
	const password=req.body.password;

	// creating database for user

	console.log(username,password);
	const conToServer=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:""

	})
	conToServer.query(`CREATE DATABASE ${username}`,(err,result)=>{
		if(err){
			console.log("can not create database for user");
			return;
		}
		console.log("created database for user");
		const conToCreatePostTable=mysql.createConnection({
			host:"localhost",
			user:"root",
			password:"",
			database:username
		})
		conToCreatePostTable.query(`CREATE TABLE post(
			username VARCHAR(255),
			media VARCHAR(255),
			caption VARCHAR(255),
			date VARCHAR(255)
			)`,(err,result)=>{
				if(err){
					console.log("can not created post table");
					return;
				}
				console.log("created post table");
				const conToInsertInUserList=mysql.createConnection({
					host:"localhost",
					user:"root",
					password:"",
					database:"instagram"
				})
				conToInsertInUserList.query(`INSERT INTO users (username) VALUES ('${username}')`,(err,result)=>{
					if(err){
						console.log("can not insert user into instagram users list");
						return;
					}
					console.log("inserted user into instagram users list");
					conToCreatePostTable.query(`CREATE TABLE followers(
						username VARCHAR(255)
						)`,(err,result)=>{
							if(err){
								console.log("can not create table of followers");
								return;
							}
							console.log("created table of followers");
							conToCreatePostTable.query(`CREATE TABLE followings(
								username VARCHAR(255)
								)`,(err,result)=>{
									if(err){
										console.log("can not create table of followings");
										return;
									}
									console.log("created table of followings");
									conToCreatePostTable.query(`CREATE TABLE requests(
										username VARCHAR(255)
										)`,(err,result)=>{
											if(err){
												console.log("can not create table of requests");
												return;
											}
											console.log("created table of requests");
											const msg="yes";
											res.json(`${msg}`);
										})

								})

						})

				})



			})

	})
})

/*

Phase 3 : 
________________________________________________________________________

				            SENDING POST
________________________________________________________________________

*/
/*
	part-1 : taking caption , username and media file location which will
	be uploaded and validated in part-2 , here we will save the post
	*/
	app.post("/post",(req,res)=>{
		const username=req.body.username;
		const caption=req.body.caption;
		const media=req.body.media;
	// const date=new Date().toLocaleDateString();
	console.log(req.body);
	console.log(username,caption,media);
	const d=new Date();
	const nowTime=d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	const nowDate=d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+nowTime;
	const date=nowDate;
	console.log(date);
	var conToMakePost=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})
	conToMakePost.query(`INSERT INTO post (username,media,caption,date) VALUES ('${username}','${media}','${caption}','${date}')`,(err,result)=>{
		if(err){
			console.log(err);
			console.log("can  not create you post");
			return;
		}
		console.log("posted you post");
		var msg="yes";
		res.json(`${msg}`);

	})
})

	/*completed part-1 storing post */

/*
	part-2: onChange storing the image and validating it for saving on server
	REMEMBER, your image will be stored in frontend folder named 'instagram' 
	location:
	/instagram/public/uploads/myMedia.PNG*JPG*JPEG*BMP

	*/
	app.post("/media",upload.single('media'),(req,res,err)=>{
		const media=req.file.filename;
		console.log(media);
		res.json(`${media}`);

	})

	/* handled onChange event for changing photo on server */
	/*done sending POST */

/*
phase:4
__________________________________________________________________________
                              
                              MAKING FOLLOWINGS
__________________________________________________________________________

*/



app.post("/follow",(req,res)=>{
	const username=req.body.username;
	const toBeFollowed=req.body.toBeFollowed;
	const conToFollow=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:toBeFollowed
	})
	conToFollow.query(`INSERT INTO requests (username) VALUES ('${username}')`,(err,result)=>{
		if(err){
			console.log("can not insert into the requests table");
			return;
		}
		console.log("inserted into the requests table");
		const msg="yes";
		res.json(`${msg}`);
	})
})


/*
 making FOLLOWINGS portion (phase-4) completed
 */

/*
	Phase-5: 
_____________________________________________________________________________

                              Accepting Request
_____________________________________________________________________________

*/

app.post("/acceptRequest",(req,res)=>{
	console.log(req.body);
	const username=req.body.username;
	const toBeAccepted=req.body.toBeAccepted;
	const conToAcceptRequest=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})
	conToAcceptRequest.query(`INSERT INTO followers (username) VALUES ('${toBeAccepted}')`,(err,result)=>{
		if(err){
			console.log("can not accept request ");
			return;
		}
		else{
			console.log("accepted request");
			conToAcceptRequest.query(`DELETE FROM requests WHERE username='${toBeAccepted}'`,(err,result)=>{
				if(err){
					console.log("added to followers but can not remove from request");
					return;
				}
				else{
					console.log("added to followers and removed from requests");

					conToInsertInFollowings=mysql.createConnection({
						host:"localhost",
						user:"root",
						password:"",
						database:toBeAccepted
					})
					conToInsertInFollowings.query(`INSERT INTO followings (username) VALUES ('${username}')`,(err,result)=>{
						if(err){
							console.log("can not insert into followings of toBeAccepted");
							return;
						}
						else{
							console.log("inserted into the followings of toBeAccepted");
							conToAcceptRequest.query(`CREATE TABLE ${toBeAccepted} (
								username VARCHAR(255),
								msg VARCHAR(255),
								media VARCHAR(255),
								dt VARCHAR(255)
								)`,(err,result)=>{
									if(err){
										console.log("you are already following them, so chat area is already created okay");
										const msg="already";
										res.json(`${msg}`);		

										return;
									}else{
										console.log("chat area created in your database");
										conToInsertInFollowings.query(`CREATE TABLE ${username} (
											username VARCHAR(255),
											msg VARCHAR(255),
											media VARCHAR(255),
											dt VARCHAR(255)
											)`,(err,result)=>{
												if(err){
													console.log("you are already following them, so chat area is already created okay");
													return;
												}else{
													console.log("chat area created in their database");
													const msg="yes";
													res.json(`${msg}`);
												}
											})
									}
								})

						}
					})
				}
			})
		}
	})
})
/*
 making FOLLOWINGS portion (phase-4) completed
 */


/*
	Phase 6: 
_____________________________________________________________________

							Processing Chat
_____________________________________________________________________

*/

app.post("/chat",(req,res)=>{
	const username=req.body.username;
	const toChatWith=req.body.toChatWith;
	const conToRetrieveChatHist=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})
	conToRetrieveChatHist.query(`SELECT * FROM ${toChatWith}`,(err,result)=>{
		if(err){
			console.log("can not fetch data from table");
			const msg="no";
			res.json(`${msg}`);
			return;
		}
		console.log("fetched data from chat");
		res.json(result);

	})
})

/*
completed Phase 6 : processed chat successfully
*/


/*
	Phase 7: 
______________________________________________________________________________

								message someone
______________________________________________________________________________
*/


app.post("/msg",(req,res)=>{
	const username=req.body.username;
	const toChatWith=req.body.toChatWith;
	const msg=req.body.msg;
	const media=req.body.media;
	const d=new Date();
	const nowTime=d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	const nowDate=d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+nowTime;
	const dt=nowDate;
	console.log(dt)
	console.log(req.body);
	const conToMsgInMe=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})
	conToMsgInMe.query(`INSERT INTO ${toChatWith} (username,msg,media,dt) VALUES ('${username}','${msg}','${media}','${dt}')`,(err,result)=>{
		if(err){
			console.log(err);
			console.log("can not send msg");
			const msg="no";
			res.json(`${msg}`);
			return;
		}
		console.log("sent msg fifty percent");
		const conToMsgInThem=mysql.createConnection({
			host:"localhost",
			user:"root",
			password:"",
			database:toChatWith
		})
		conToMsgInThem.query(`INSERT INTO ${username} (username,msg,media,dt) VALUES ('${username}','${msg}','${media}','${dt}')`,(err,result)=>{
			if(err){
				console.log("can not send messege at all in reciever");
				const msg="no";
				res.json(`${msg}`);
				return;
			}
			console.log("send msg 100%");
			const msg="yes";
			res.json(`${msg}`);

		})
	})
})


/*
	completed Phase 7 : messeged someone successfully
*/


/*
Phase 8: 
_______________________________________________________________________________

                                 refreshing feed
_______________________________________________________________________________
*/

app.post("/feed",(req,res)=>{
	const username=req.body.username;
	const followings=[];
	const feed=[];
	const conForFeed=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})

	conForFeed.query(`SELECT * FROM followings`,(err,result)=>{
		if(err){
			console.log("can not fetch feed");
			const msg="no";
			res.json(`${msg}`);
			return;
		}
		console.log("fetched users followings");
		for(let i=0;i<result.length;i++){
			followings.push(result[i].username);
			// console.log(followings[i]);
		}
		console.log(followings.length);
		if(followings.length===0){
			const msg="no";
			res.json(`${msg}`);	
		}
		for(let i=0;i<followings.length;i++){
			console.log("in for loop:");
			const conToFetchFeedFromFollowings=mysql.createConnection({
				host:"localhost",
				user:"root",
				password:"",
				database:followings[i]
			})
			conToFetchFeedFromFollowings.query(`SELECT * FROM post`,(err,result2)=>{
				console.log("in conToFetchFeedFromFollowings");
				if(err){
					console.log(`can not fetch posts from ${followings[i]}`);
					const msg="no";
					res.json(`${msg}`);
					return;
				}
				else{
					console.log(`fetched data from ${followings[i]}`);
					for(let j=0;j<result2.length;j++){
						feed.push(result2[j]);
						console.log(feed);
						// console.log(result2[j]);
					}
					if(i===followings.length-1){
						console.log("below is feed");
						function compare(a,b){
							if(a.date<b.date) return 1;
							if(a.date>b.date) return -1;
							return 0;
						}
						feed.sort(compare);
						console.log(feed);
						res.json(feed);
					}
				}
			})

		}
		
	})

})

/*
completed Phase 8 , refreshed feed
*/



/*
	Phase 9:
_______________________________________________________________________

                              Getting followings
_______________________________________________________________________

*/


app.post("/getFollowings",(req,res)=>{
	console.log(req.body);
	const username=req.body.username;
	const followingList=[];
	const conToGetFollowings=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})
	conToGetFollowings.query(`SELECT * FROM followings`,(err,result)=>{
		if(err){
			console.log(`can not get followings list of ${username}`);
			const msg="no";
			res.json(`${msg}`);
			return;
		}
		console.log(`got the followings list of ${username}`);
		for(let i=0;i<result.length;i++){
			followingList.push(result[i].username);
		}
		followingList.sort();
		console.log(followingList);
		res.json(followingList);
	})
})

/*
Completed phase 9 Got Followings
*/


/*
	Phase 10:
_____________________________________________________________________

                             Getting Followers
_____________________________________________________________________

*/


app.post("/getFollowers",(req,res)=>{
	console.log(req.body);
	const username=req.body.username;
	const followerList=[];
	const conToGetFollowers=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})
	conToGetFollowers.query(`SELECT * FROM followers`,(err,result)=>{
		if(err){
			console.log(`can not get Followers list of ${username}`);
			const msg="no";
			res.json(`${msg}`);
			return;
		}
		console.log(`Got followers list of ${username}`);
		for(let i=0;i<result.length;i++){
			followerList.push(result[i].username);
		}
		followerList.sort();
		console.log(followerList);
		res.json(followerList);
	})
})


/*
completed Phase 10 Got Followers
*/

/*
Phase 11:
_______________________________________________________________________

								Refresh Chat
_______________________________________________________________________

*/


app.post("/refreshChat",(req,res)=>{
	console.log(req.body);
	const username=req.body.username;
	const toChatWith=req.body.toChatWith;
	const conToRefreshChat=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})
	conToRefreshChat.query(`SELECT * FROM ${toChatWith}`,(err,result)=>{
		if(err){
			console.log(`can not refresh chat`);
			const msg="no";
			res.json(`${msg}`);
		}
		console.log(`refreshed chat`);
		res.json(result);
	})
})



/*
Completed phase 11 , Refreshed Chat 
*/

/*
Phase 12:
_____________________________________________________________________

						fetchPosts of user
_____________________________________________________________________

*/

app.post("/fetchPostsOfUser",(req,res)=>{
	console.log(req.body);
	const profileName=req.body.username;
	const postList=[];
	const conToFetchPostsOfUser=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:profileName
	})
	conToFetchPostsOfUser.query(`SELECT * FROM post`,(err,result)=>{
		if(err){
			console.log(`can not fetch posts of  ${profileName}`);
			const msg="no";
			res.json(`${msg}`);
			return;
		}
		console.log(`fetched posts of ${profileName}`);
		for(let i=0;i<result.length;i++){
			postList.push(result[i]);
		}
		function compare(a,b){
			if(a.date<b.date) return 1;
			if(a.date>b.date) return -1;
			return 0;
		}
		postList.sort(compare);
		console.log(postList);
		res.json(postList);
	})
})

/*
completed phase 12 , fetched posts of user
*/

/*
Phase 13:
________________________________________________________________________________

							 Find User
________________________________________________________________________________

*/


app.post("/findUser",(req,res)=>{
	console.log(req.body);
	const toBeFound=req.body.toBeFound;
	const matchingUsers=[];
	const conToFindUser=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:"instagram"
	})
	conToFindUser.query(`SELECT * FROM users`,(err,result)=>{
		if(err){
			console.log("can not find any users due to some system fault in server");
			const msg="no";
			res.json(`${msg}`);
			return;
		}
		console.log("able fetch the users of instagram");
		for(let i=0;i<result.length;i++){
			const selectedUser=result[i].username;
			let count=0;
			for(let j in toBeFound){
				selectedUser.includes(toBeFound[j])?count++:false;
			}
			console.log(count);
			if(count>0){
				matchingUsers.push(selectedUser);
			}
		}
		function compare(a,b){
			if(a[0]==toBeFound[0]) return -1;
			if(b[0]==toBeFound[0]) return 1;
			if(a.date<b.date) return -1;
			if(a.date>b.date) return 1;
			return 0;
		}
		matchingUsers.sort(compare);
		console.log(matchingUsers);
		res.json(matchingUsers);
	})
})


/*

Completed Phase 13, checked for user in users list(found out user)

*/

/*
	Phase 10:
_____________________________________________________________________

                             Getting Requests
_____________________________________________________________________

*/


app.post("/getRequests",(req,res)=>{
	console.log(req.body);
	const username=req.body.username;
	const requests=[];
	const conToGetFollowers=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:username
	})
	conToGetFollowers.query(`SELECT * FROM requests`,(err,result)=>{
		if(err){
			console.log(`can not get requests list of ${username}`);
			const msg="no";
			res.json(`${msg}`);
			return;
		}
		console.log(`Got requests list of ${username}`);
		for(let i=result.length-1;i>=0;i--){
			requests.push(result[i]);
		}
		console.log(requests);
		res.json(requests);
	})
})


/*
completed Phase 14 Got Requests
*/


/*
	===========
   ||LAST PHASE||
	===========
	last phase configuring messege that determines that whether server is
	connected or not
	*/	


	app.listen(2498,()=>{
		console.log("Shripad Shree Vallabh is blessing to you on port 2498");
	})	


/*
and that's done
====================================================================
					      GURUDEV DATT
====================================================================
*/