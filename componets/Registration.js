import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from  'axios'
import { useNavigate } from "react-router-dom";
import '../style/styleregistartion.css'
 export function Registration(){

    const[username,setUsername]=useState()
    const[email,setEmail]=useState()
    const[password,setPassword]=useState()
    const navigate = useNavigate()
    const handlesubmit =(e)=>{
        e.preventDefault()
      
        if (!/^[A-Z]/.test(password)) {
            alert("Password must start with a capital letter.");
            return;
          }
      
          if (!/\d/.test(password)) {
            alert("Password must contain at least one number.");
            return;
          }
      
          if (password.length > 10) {
            alert("Password must not exceed 10 characters.");
            return;
          }
        




        axios.post('http://localhost:5000/register',{username,email,password})
        .then(res =>navigate('/login'))
        .then(err => console.log(err))
        }
    return(
        <>
   <div className={'registrationContainer'}>
      <form onSubmit={handlesubmit} className={"registrationForm"}>
        <h2>Sign Up</h2>
        <label className={'formLabel'}>UserName</label><br>
        </br>
        <input type="text" name="username" className={"formInput"} placeholder="username" onChange={e=>setUsername(e.target.value)}></input><br></br>
        <lable className={'formLabel'}>
            Enter your Email and it your username also
        </lable><br></br>
   <input type="email" name="email" placeholder="Email"  className={"formInput"} onChange={e=>setEmail(e.target.value)}></input><br></br>
   <label className={'formLabel'}>
    Enter password  :<span>The password must start with a capital letter.
It must contain at least one number.
and not exceed 10 characters in length.</span>
   </label><br></br>
   <input type="password"  className={"formInput"} name="password" placeholder="Password" onChange={e=>setPassword(e.target.value)}></input><br></br>
   <br>
   </br>
 <button className={"formButton"}>click to sign up</button><br></br>
<br></br>
      </form>
      <Link to="/Login"><button className={"linkButton"}>click for login</button></Link><br></br>
      </div>
        </>
    )
}