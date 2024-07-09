import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { userContext } from "../App";
import { useContext } from "react";
import '../style/styleforedit.css'
 export function Pos (){
    
     const {id}=useParams()
     const [post,setPost]=useState({});
     const navigate = useNavigate()
     const user =useContext(userContext)
     useEffect(()=>{
     
        axios.get('http://localhost:5000/getpostbyid/'+id)
        .then(result => setPost(result.data))
        .catch(err => console.log(err))
     },[])

     const handleDelete = (id) =>{
        axios.delete('http://localhost:5000/deletepost/'+id)
        .then(result => {navigate('/')})
        .catch(err => console.log(err))

     }


    //  const fetchPosts = () => {
  
    //     axios.get('http://localhost:5000/getposts')
    //         .then(response => {
    //             setPost(response.data)
    //         })
    //         .catch(err => console.log(err))
    //   };


      
     const handleCommentDelete = (postId, commentId) => {
        if (!user || !user.email) {
          alert('Please log in to delete the comment.');
          return;
        }
      
        axios.delete(`http://localhost:5000/deletecomment/${postId}/${commentId}`, {
          data: { userId: user.email },
        })
          .then(response => {
            window.location.href=`/post/${post._id}`
            // fetchPosts();
          })
          .catch(error => console.error('Error deleting the comment:', error));
      };




      const handleShare = async () => {
        try {
          if (navigator.share) {
            await navigator.share({
              title: post.title,
              text: post.description,
              url: window.location.href,
            });
          } else {
            alert("Sharing not working");
          }
        } catch (error) {
          console.error('Error  insharing:', error);
         
        }
      };
      



    return(
        <>
        <div className={'my'}>
            <div>
                <img src={`http://localhost:5000/Images/${post.file}`}></img>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <button onClick={handleShare}>Share the post</button>
                {post.comments && post.comments.map((comment, index) => (
        <div key={comment._id} className="comment">
        <p><b>{comment.userId}:</b> {comment.text} </p>

        {user && (user.email === comment.userId || user.email === post.userId) && (
          <button onClick={() => handleCommentDelete(post._id, comment._id)}>
            Delete the comment
          </button>
        )}
        
       
    </div>
))}
        
            </div>
  <div>
     {
      user && user.email === post.email ? (
        <>
            <Link to={`/editpost/${post._id}`}><button>Edit</button></Link>
            <button onClick={() => handleDelete(post._id)}>DELETE</button>
     
        </>
    ) : null
}
 </div>
        </div>
       
 </>
    )
}