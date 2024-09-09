const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path:path.resolve(__dirname,'../.env')});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'})
const fs = require('fs');

const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

//MIDDLEWARES
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

let port = process.env.PORT||4000;
mongoose.connect(process.env.MONGO_URI);
// console.log(process.env.MONGO_URI);


//Endpoint for registering a user. 
app.post('/register',async (req,res)=>{
    const{username,password} = req.body;
    try {
        const compareUser = await User.findOne({username})
        if(username.length >= 4 && !compareUser){
        await User.create({username,password:bcrypt.hashSync(password,salt)})
        }
        else{
            res.status(400).json('minimum 4 letters are required.')
        }
        res.json({userData:{username,password}});
        console.log('App listening at port: '+port);
    } catch (error) {
        console.log(error);
    }
})

//Endpoint for user login.
app.post('/login',async(req,res)=>{
    const{username,password} = req.body;
    try {
        const grabUser = await User.findOne({username});
        const comparePassword = bcrypt.compareSync(password,grabUser.password);
        if(comparePassword){
            //logged in. 
            jwt.sign({username,id:grabUser._id},secret,{},(err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json({
                    id:grabUser._id,
                    username,
                })
            })
        }
        else{
            res.status(400).json('wrong credentials.') 
        }
    } catch (error) {
        res.status(400).json('wrong credentials.')
    }
   
    // else{
    //         res.status(400).json('wrong credentials.')
    //     }

})

//Endpoint for verifying the jwt token of the user currently logged in.
app.get('/profile',(req,res)=>{
    const{token} = req.cookies;
    jwt.verify(token,secret,{},(err,userInfo)=>{
        if (err) throw err;
        res.json(userInfo);
    });
    // res.json(req.cookies);
})

//Endpoint for logging out.
app.post('/logout',(req,res)=>{
    res.cookie('token','').json('logout ok');
})

//Endpoint for saving a new blog post in the database.And to upload the files in the uploads directory.
app.post('/createNewPost', uploadMiddleware.single('file') , async(req,res)=>{
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path + '.' + ext;
    fs.renameSync(path,newPath);

    const{token} = req.cookies;
    jwt.verify(token,secret,{}, async(err,userInfo)=>{
        if (err) throw err;
        //Saving the blog post in the database.
        const{title,summary,content} = req.body;
        const postDoc = await Post.create({title,summary,content,blogImg:newPath,author:userInfo.id});
        res.json(postDoc);
    });
})

//Endpoint for creating a post of the currently logged in user. 
app.get('/createNewPost',async(req,res)=>{
        const posts = await Post.find().populate('author',['username']).sort({createdAt:-1});
        res.json(posts);   
})

//Endpoint for the edited post to be displayed.
app.put('/createNewPost', uploadMiddleware.single('file'), async(req,res)=>{
    let newPath = null;
    if (req.file) {
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path + '.' + ext;
        fs.renameSync(path,newPath);
    }
    const{token} = req.cookies;
    jwt.verify(token,secret,{}, async(err,userInfo)=>{
        if (err) throw err;
        const{title,summary,content,id} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(userInfo.id);
        //Updating the blog post in the database.
        if (!isAuthor) {
            return res.status(400).json('you are not the author.');
        }
        await postDoc.updateOne(
            {
            title,
            summary,
            content,
            blogImg:newPath?newPath:postDoc.blogImg,
            }
        );
        res.json(postDoc);
    });
})

//Endpoint for displaying the selected post in full page mode. 
app.get('/post/:id', async(req,res)=>{
    const{id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

//Endpoint for deleting a post from the database.
app.delete('/deletePost/:id', async (req,res)=>{
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
})

app.listen(port)

