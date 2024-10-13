import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const server = express();
const PORT = process.env.PORT || 3000;

// Regular expressions for validation
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

server.use(express.json());
server.use(cors());

// MongoDB Connection
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

 const formatdatatosend=(user)=>{

    const access_token=jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY, {expiresIn: '1d'});
    return({
        access_token,
        profile_img:user.personal_info.profile_img,
        username:user.personal_info.username,
        fullname:user.personal_info.fullname,
    }
    )
 }

// Username generation logic
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameNotUnique = await User.exists({ "personal_info.username": username });
  
  if (isUsernameNotUnique) {
    username += nanoid().substring(0, 2); // Append random characters if username is taken
  }

  return username;
};

// Sign-in endpoint
server.post('/signup', (req, res) => {
  let { fullname, email, password } = req.body;

  
  if (fullname.length < 3) {
    return res.status(400).json({ "error": "Fullname must be at least 3 characters long" });
  }

  if (!email.length) {
    return res.status(400).json({ "error": "Email must be provided" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ "error": "Invalid email" });
  }


  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      "error": "Password must be 6-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
    });
  }

  // Hash password
  bcrypt.hash(password, 10, async (err, hashed_password) => {
    if (err) {
      return res.status(500).json({ "error": "Error hashing password" });
    }

    // Generate a unique username based on the email
    let username = await generateUsername(email);

    // Create a new user object
    let user = new User({
      personal_info: { fullname, email, password: hashed_password, username }
    });

    // Save user to the database
    user.save().then((u) => {
        return res.status(200).json(formatdatatosend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(400).json({ "error": "Email already exists" });
        }
        return res.status(500).json({ "error": err.message });
      });
  });
});

server.post('/signin',(req,res)=>{
    let {email,password}=req.body;
    User.findOne({"personal_info.email":email}).then((user)=>{
        if(!user){
            return res.status(403).json({ "error": "email not found" });
        }
        bcrypt.compare(password,user.personal_info.password,(err,result)=>{
            if(err){
                return res.status(403).json({"error":"error occurred while loging please try again"}); 
            }   
            if(!result){
                return res.status(403).json({"error":"incorrect password"});
            }
            if(result){
                return res.status(200).json(formatdatatosend(user))
            }
        });

    })
    .catch((err)=>{
        console.log(err.message);
        return res.status(500).json({ "error": err.message });
    })
});


server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
