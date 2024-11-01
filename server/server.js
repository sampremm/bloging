import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from "firebase-admin";
import serviceAccountkey from "./react-js-blog-website-c9a24-firebase-adminsdk-dndxz-48a34e334c.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";

const server = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountkey),
});

// Regular expressions for validation
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

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

// Format data to send to the client
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
  let isUsernameNotUnique = await User.exists({ "personal_info.username": username });

  if (isUsernameNotUnique) {
    username += nanoid().substring(0, 2); // Append random characters if username is taken
  }

  return username;
};

// Sign-up endpoint
server.post('/signup', (req, res) => {
  const { fullname, email, password } = req.body;

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
    const username = await generateUsername(email);

    // Create a new user object
    const user = new User({
      personal_info: { fullname, email, password: hashed_password, username }
    });

    // Save user to the database
    user.save().then((u) => {
        return res.status(200).json(formatDataToSend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(400).json({ "error": "Email already exists" });
        }
        return res.status(500).json({ "error": err.message });
      });
  });
});

// Sign-in endpoint
server.post('/signin', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ "personal_info.email": email }).then((user) => {
        if (!user) {
            return res.status(403).json({ "error": "Email not found" });
        }

        if(!user.google_auth){
          bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (err) {
                return res.status(403).json({ "error": "Error occurred while logging in, please try again" });
            }
            if (!result) {
                return res.status(403).json({ "error": "Incorrect password" });
            }
            return res.status(200).json(formatDataToSend(user));
          });
        }else{
          return res.status(403).json({ "error": "account was created using google try loging with google" });
        }
        

    }).catch((err) => {
        console.log(err.message);
        return res.status(500).json({ "error": err.message });
    });
});

// Google authentication endpoint
server.post("/google-auth", async (req, res) => {
    const { access_token } = req.body;
    getAuth().verifyIdToken(access_token)
    .then(async (decodedUser) => {
        let { email, name, picture } = decodedUser;
        picture = picture.replace("=s96-c", "=s384-c"); // High resolution image

        let user = await User.findOne({ "personal_info.email": email })
            .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
            .then((u) => u || null)
            .catch((err) => res.status(500).json({ "error": err.message }));

        if (!user) {
            const username = await generateUsername(email);
            user = new User({
                personal_info: {
                    fullname: name,
                    email,
                    profile_img: picture,
                    username
                },
                google_auth: true
            });
            await user.save()
                .then((u) => user = u)
                .catch((err) => res.status(500).json({ "error": err.message }));
        }
        if (!user.google_auth) {
            return res.status(403).json({ "error": "This email was signed in with Google. Please login with email and password" });
        }
        return res.status(200).json(formatDataToSend(user));
    })
    .catch((err) => {
        return res.status(500).json({ "error": "Failed Google authentication" });
    });
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
