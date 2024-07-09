import axios from "axios";
import React, { useEffect, useState } from "react";
import '../style/stylepost.css'
import { Link } from 'react-router-dom'; 
import { userContext } from "../App";
import { useContext } from "react";
 export function Home(){

    const [posts,setPosts]=useState([]);
    const [comments, setComments] = useState({});
    const user =useContext(userContext)

    useEffect(()=>{
        axios.get('http://localhost:5000/getposts')
        .then(posts => {
            setPosts(posts.data)
        })
        .catch(err=>console.log(err))
    },[])

//  like and comment from my home 

const handleLike = (postId) => {
  if (!user || !user.email) {
    
    alert('Please log in to like the post.');
    return;
  }

  axios.put(`http://localhost:5000/likepost/${postId}`, { userId: user.email })
    .then(response => {

      fetchPosts();
    })
    .catch(error => console.error('Error liking the post:', error));
};

const handleCommentChange = (postId, value) => {
  setComments({
    ...comments,
    [postId]: value
  });
};

const handleComment = (postId) => {

  const commentText = comments[postId];
  if (!user || !user.email) {
    // for log in alerts
    alert('Please log in to comment the post');
    return;
  }

  if (!commentText) {
    alert('Please enter a comment.');
    return;
  }

  axios.post(`http://localhost:5000/commentpost/${postId}`, {
    userId: user.email,
    text: commentText
  })
    .then(response => {
      fetchPosts();
      setComments({ ...comments, [postId]: '' });
    })
    .catch(error => console.error('Error commenting on the post:', error));
};



const fetchPosts = () => {
  
  axios.get('http://localhost:5000/getposts')
      .then(response => {
          setPosts(response.data)
      })
      .catch(err => console.log(err))
};


    return(
       <>
 <>
 <div className={"main-container"}>
    <h1 className="homeh1">HO<span style={{color:'red'}}>ME</span></h1>
      
      <div className={"posts-container"}>
        {posts.map(post => (
          <a><Link to={`/post/${post._id}` }>
          <div className={"post"} key={post._id}>
            <img src={`http://localhost:5000/Images/${post.file}`}></img>
            <h3>{post.readMore ? post.title : `${post.title.substring(0, 50)}...`}</h3>
            <p>
              {post.readMore ? post.description : `${post.description.substring(0, 150)}...`}
                
              </p>
              
          </div>
          
          </Link>
          <button  className={"like"} onClick={() => handleLike(post._id)}>Like / Un</button>
          <span>{post.likes.length} Likes</span>
            <input 
              type="text" 
              className={"comment-input"}
              placeholder="Add a comment" 
              value={comments[post._id] || ''} 
              onChange={(e) =>handleCommentChange (post._id, e.target.value)}
            />
            <button className={"like"} onClick={() => handleComment(post._id)}>Comment</button> 
          </a>
            ))}
       
      </div>
      </div>
    </>
    </>
    )

}