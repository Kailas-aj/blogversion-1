import React, { useEffect, useState } from "react";
import '../style/stylecreate.css'
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
 export function Editpost(){

   
    const [title,setTitle]=useState();
    const [description,setDescription]=useState();
    
    const {id}=useParams()
    const navigate = useNavigate()
   
    const handlesubmit =(e)=>{
        e.preventDefault()
 

        axios.put('http://localhost:5000/editpost/'+id,{title,description})
        .then(res =>{
            if(res.data==="success"){
              navigate('/')
                
            }
        })
        .catch(err => console.log(err))
 }

 useEffect(()=>{
  axios.get('http://localhost:5000/getpostbyid/'+id)
 .then(result => {setTitle(result.data.title)
                   setDescription(result.data.description)
 })
 .catch(err => console.log(err))
},[])

    return(
        <>
        <div className="di">
            <h1>update post </h1>
            <form onSubmit={handlesubmit}>
                <input type="text" placeholder="Enter text" value={title} onChange={e=>setTitle(e.target.value)}></input> 
                <textarea name="desc" id="desc" cols="30" rows="10" value={description} onChange={e=>setDescription(e.target.value)}></textarea>
                
                <button>update</button>
            </form>
           
        


        </div>
        </>
    )

}
