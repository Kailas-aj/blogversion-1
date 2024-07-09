
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Naves } from './Naves';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Registration } from './componets/Registration.js';
import { Login } from './componets/Login.js';
import { Home } from './componets/Home.js';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CreatePost } from './componets/CreatePost.js';
import { Pos } from './componets/Pos.js';
import { Editpost } from './componets/EditPost.js';



 export const userContext = createContext()

function App() {

 const [user,setUser]=useState()
   axios.defaults.withCredentials=true;
  useEffect(()=>{
    axios.get('http://localhost:5000/')
    .then(user =>{
      setUser(user.data)})
    .catch(err =>console.log(err))
  },[])
  return (
    <>
   <userContext.Provider value={user} >
    <BrowserRouter>
    <Naves/>
<Routes>
<Route path ='/Create' element ={<CreatePost/>}></Route>
  <Route path ='/' element ={<Home/>}></Route>
  <Route path='/regi' element={<Registration/>}></Route>
  <Route path='/Login' element={<Login/>}></Route>
  <Route path='/post/:id' element={<Pos/>}></Route>
  <Route path='/editpost/:id' element={<Editpost/>}></Route>

</Routes>

</BrowserRouter>
</userContext.Provider>
 </>
  );

}

export default App;
