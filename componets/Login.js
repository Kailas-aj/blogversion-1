import { Button } from "bootstrap";
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../style/stylelogin.css'
  export function Login(){
   const[email,setEmail]=useState()
    const[password,setPassword]=useState()
    const navigate = useNavigate()

    const handlesubmit =(e)=>{
        e.preventDefault()
        axios.post('http://localhost:5000/login',{email,password})
        .then(res =>{
            if(res.data==="success"){
                window.location.href="/"
            }
        })
        .catch(err => console.log(err))
        }


 return(
    <>
    <div className={'loginContainer'}>
   <h1 className={"formTitle "}>Login for Blog App</h1>
    <form onSubmit={handlesubmit} className='loginForm'>
        <label>UserName eg: Email ID</label><br></br>
        <input type="email" name="email" placeholder="Username (email)" onChange={e=>setEmail(e.target.value)}></input><br></br>
        <label>PassWord</label><br></br>
        <input type="password" name="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}></input><br></br>
        <br></br>
       <button className={"formButton"}> click to login</button><br></br><br></br>
       
    </form>

    <Link to="/regi"><button  className={"signupButton"}>click for signup</button></Link>
    
    </div>
</>
 )
 
}