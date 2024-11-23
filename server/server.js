import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from "firebase-admin";
import serviceAccountKey from "./react-js-blog-website-c9a24-firebase-adminsdk-dndxz-48a34e334c.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";
import aws from 'aws-sdk';
import Blog from './Schema/Blog.js';



const server = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Regular expressions for validation
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

// Middleware setup
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

// AWS S3 Configuration
const s3 = new aws.S3({
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Helper function to generate S3 upload URL
const generateUploadUrl = async () => {
  const timestamp = Date.now();
  const imageKey = `${nanoid()}-${timestamp}.jpeg`;
  return s3.getSignedUrlPromise('putObject', {
    Bucket: 'bloging-mern',
    Key: imageKey,
    ContentType: 'image/jpeg',
    Expires: 1000,
  });
};

const verifyjwt = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(403).json({ message: "Access denied: Invalid token" });
    }

    req.user = user;
    next();
  });
};

// Helper function to format data for client
const formatDataToSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY, { expiresIn: '1d' });
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// Username generation logic
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  const isUsernameTaken = await User.exists({ "personal_info.username": username });

  if (isUsernameTaken) {
    username += nanoid().substring(0, 2); // Append random characters if username is taken
  }
  return username;
};

// Route to generate upload URL for S3
server.get('/uploadurl', (req, res) => {
  generateUploadUrl()
    .then(url => res.status(200).json({ uploadURL: url }))
    .catch(err => {
      console.error("Error generating upload URL:", err);
      res.status(500).json({ message: "Error generating upload URL" });
    });
});

// Sign-up endpoint
server.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res.status(400).json({ error: "Fullname must be at least 3 characters long" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must be 6-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);
    const user = new User({
      personal_info: { fullname, email, password: hashedPassword, username }
    });

    const savedUser = await user.save();
    res.status(200).json(formatDataToSend(savedUser));
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Error creating user" });
    }
  }
});

// Sign-in endpoint
server.post('/signin', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then(user => {
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err || !result) {
            console.error("Password comparison error:", err || "Incorrect password");
            return res.status(403).json({ error: "Incorrect email or password" });
          }
          return res.status(200).json(formatDataToSend(user));
        });
      } else {
        res.status(403).json({ error: "Account created with Google. Please use Google login." });
      }
    })
    .catch(err => {
      console.error("Sign-in error:", err);
      res.status(500).json({ error: "Error signing in" });
    });
});

// Google authentication endpoint
server.post("/google-auth", async (req, res) => {
  const { access_token } = req.body;

  getAuth().verifyIdToken(access_token)
    .then(async decodedUser => {
      const { email, name, picture } = decodedUser;
      let user = await User.findOne({ "personal_info.email": email }).select("personal_info fullname username profile_img google_auth");

      if (!user) {
        const username = await generateUsername(email);
        user = new User({
          personal_info: { fullname: name, email, profile_img: picture.replace("=s96-c", "=s384-c"), username },
          google_auth: true
        });
        await user.save();
      } else if (!user.google_auth) {
        return res.status(403).json({ error: "This email is registered. Please use email login." });
      }

      return res.status(200).json(formatDataToSend(user));
    })
    .catch(err => {
      console.error("Google authentication error:", err);
      res.status(500).json({ error: "Failed Google authentication" });
    });
});

server.post('/createblog', verifyjwt, async (req, res) => {
  const authorID = req.user.id;
  const { title, banner, content, des, draft } = req.body;
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required" });
  }
  if(!draft){
    if (!des || des.trim().length === 0 || des.trim().length > 200) {
      return res.status(400).json({ error: "Description must be between 1 and 200 characters" });
    }
    
    if (!banner || banner.trim().length === 0) {
      return res.status(400).json({ error: "Banner is required" });
    }
   
    if (!content || !Array.isArray(content.blocks) || content.blocks.length === 0) {
      return res.status(400).json({ error: "Content must have at least one block" });
    }  

  }

 
 
  // Generate blog ID
  let blog_id = title.replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "-").trim() + nanoid();

  try {
    // Save the blog
    const blog = new Blog({
      title,
      des,
      banner,
      content,
      author: authorID,
      draft: Boolean(draft),
      blog_id,
    });

    const savedBlog = await blog.save();

    // Update the user with blog info
    let incrementVal = draft ? 0 : 1;
    await User.findOneAndUpdate(
      { _id: authorID },
      {
        $inc: { "account_info.total_posts": incrementVal },
        $push: { blogs: savedBlog._id },
      }
    );

  
    return res.status(200).json({ id: savedBlog.blog_id });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Failed to create blog" });
  }
});


server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
