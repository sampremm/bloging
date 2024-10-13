
import { initializeApp } from "firebase/app";

import {getAuth, GoogleauthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCLru5RwPMKcOPtaduRSh5crOBiM0tAFEo",
  authDomain: "react-js-blog-website-c9a24.firebaseapp.com",
  projectId: "react-js-blog-website-c9a24",
  storageBucket: "react-js-blog-website-c9a24.appspot.com",
  messagingSenderId: "118203446965",
  appId: "1:118203446965:web:a1f9add898121e10eef0fc"
};

 
const app = initializeApp(firebaseConfig);

const provider = new GoogleauthProvider();

const auth = getAuth();

const authwithgoogle= ()=>{
    let user=null;
}