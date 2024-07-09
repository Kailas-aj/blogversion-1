const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieparser = require("cookie-parser")
const  jwt = require("jsonwebtoken")
const UserModel = require('./model/UserModel')
const bcrypt = require('bcrypt');
const postModel =require('./model/PostModel')
const multer = require('multer');
const path = require('path');


const app = express();

app.use(express.json())

app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

app.use(cookieparser())

app.use(express.static('public'))


mongoose.connect('mongodb://127.0.0.1:27017/blog')


const verifyUser =(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.json("the token is missing")
    }else{
        jwt.verify(token,"jwt-secret-key",(err,decoded)=>{
            if(err){
                return res.json("the token is wrong")
            }else{
                req.email = decoded.email;
                req.username =decoded.username;
                next()
            }   
        })
    }
}

app.get('/',verifyUser,(req,res)=>{
    return res.json({email:req.email,username:req.username})

})

app.post('/register',(req,res)=>{
    const {username,email,password}=req.body;
    bcrypt.hash(password,10)
   .then(hash =>{
    UserModel.create({username,email,password:hash})
    .then(user =>res.json(user))
    .catch(err =>res.json(err))
   }).catch(err=>console.log(err))
})


app.post('/login',(req,res)=>{
    const {email,password}=req.body;
    UserModel.findOne({email:email})
    .then(user=>{
        if(user){
              bcrypt.compare(password,user.password,(err,response)=>{
                if(response){
                   const token = jwt.sign({email:user.email,username:user.username},
                            "jwt-secret-key",{expiresIn:'1d'})
                            res.cookie('token',token)
                            return res.json("success")
                        
                }else{
                    return res.json("password is incorrect")
                }
            })
        }
        else{
            res.json("user not exist")
        }
    })
})

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/Images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage
})

app.post('/Create',verifyUser,upload.single('file') ,(req,res)=>{


    postModel.create({title:req.body.title,
        description:req.body.description,
        file:req.file.filename,email:req.body.email})
        .then(result => res.json("success"))
        .catch(err =>res.json(err))
     
})


// app.get('/getposts',(req,res)=>{
//     postModel.find()
//     .then(posts => res.json(posts))
//     .catch(err => res.json(err))
// })

app.get('/getposts', (req, res) => {
    postModel.find()
        .sort({ _id: -1 }) 
        .then(posts => res.json(posts))
        .catch(err => res.json(err));
});



app.get('/getpostbyid/:id',(req,res)=>{
    const id =req.params.id
    postModel.findById({_id:id})
    .then(post => res.json(post))
    .catch(err => console.log(err))
})


app.put('/editpost/:id',(req,res)=>{
    const id = req.params.id;
    postModel.findByIdAndUpdate({_id:id},{
        title:req.body.title,
        description:req.body.description})
        .then(result => res.json("success"))
        .catch(err => res.json(err))
})


app.delete('/deletepost/:id',(req,res)=>{
    postModel.findByIdAndDelete({_id:req.params.id})
    .then(result => res.json('success'))
    .catch(err =>res.json(err))
})




// like and comment option

// Assuming other parts of your server setup remain unchanged

// Like a post
// app.put('/likepost/:id', async (req, res) => {
//     const postId = req.params.id;
//     const userEmail = req.body.userId;

//     try {
//         const user = await UserModel.findOne({ email: userEmail });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const post = await postModel.findByIdAndUpdate(
//             postId,
//             { $addToSet: { likes: user._id } },
//             { new: true }
//         );

//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         res.json(post);
//     } catch (error) {
//         console.error('Error liking the post:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });





app.put('/likepost/:id', async (req, res) => {
    const postId = req.params.id;
    const userEmail = req.body.userId;

    console.log(postId);
    console.log(userEmail);

    try {
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not founded' });
        }

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not founded' });
        }

        const Liked = post.likes.includes(user._id);

        if (Liked) {
            
            post.likes.pull(user._id);
        } else {
           
            post.likes.push(user._id);
        }

        const updatedPost = await post.save();

        res.json(updatedPost);
    } catch (error) {
        console.error('Error liking/unliking the post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/commentpost/:id', async (req, res) => {
    const postId = req.params.id;
    const { userId, text } = req.body;
    
    try {
        const post = await postModel.findByIdAndUpdate(
            postId,
            { $push: { comments: { userId , text } } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error commenting on the post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/deletecomment/:postId/:commentId', verifyUser, async (req, res) => {
    const { postId, commentId } = req.params;
    try {
        // Directly attempt to remove the comment using $pull
        const updatedPost = await postModel.findByIdAndUpdate(postId, {
            $pull: { comments: { _id: commentId, userId: req.email } } // Adjust based on your schema
        }, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found or Comment not found' });
        }

        res.json({ message: ' deleted successfully', updatedPost });
    } catch (error) {
        console.error('Error deleting the comment:', error);
        res.status(500).json({ error: 'Internal error man' });
    }
});









// logout button
app.get('/logout',(req,res)=>{

    res.clearCookie('token');
    return res.json("success")
})






app.listen(5000,()=>{
    console.log("server is ready 5000 ")

})