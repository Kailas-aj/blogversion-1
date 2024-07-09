import React, { useState } from "react";
import '../style/stylecreate.css'
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import { userContext } from "../App";
import { useContext } from "react";
 export function CreatePost(){

    const [title,setTitle]=useState();
    const [description,setDescription]=useState();
    const [file,setFile]=useState();
    const user =useContext(userContext)
    

    const handlesubmit =(e)=>{
        e.preventDefault()
        const formData = new FormData()
        formData.append('title',title)
        formData.append('description',description)
        formData.append('file',file)
        formData.append('email',user.email)

        axios.post('http://localhost:5000/Create',formData)
        .then(res =>{
            if(res.data==="success"){
                window.location.href="/"
            }
        })
        .catch(err => console.log(err))


    }
    return(
        <>
        <div className="di">
            <h1>create a post</h1>
            <form onSubmit={handlesubmit}>
                <input type="text" placeholder="Enter text" onChange={e=>setTitle(e.target.value)}></input> 
                <textarea name="desc" id="desc" cols="30" rows="10" onChange={e=>setDescription(e.target.value)}></textarea>
                <input type="file" name="" id="" onChange={e=>setFile(e.target.files[0])}/>
                <button>post</button>
            </form>
        </div>
        </>
    )

}