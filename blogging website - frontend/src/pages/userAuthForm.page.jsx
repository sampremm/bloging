import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleicon from "../imgs/google.png";
import Animationwapper from "../common/page-animation";
import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const { userAuth, setUserAuth } = useContext(UserContext);
  const access_token = userAuth ? userAuth.access_token : null;
  const userAuthThroughServer = async (serverRoot, formData) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoot}`, formData);
      storeInSession("user", JSON.stringify(data));
      setUserAuth(data);
      toast.success("Authentication successful!");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred during authentication.";
      toast.error(errorMessage);
      console.error("Authentication error:", error);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoot = type === "sign-in" ? "/signin" : "/signup";

    // Collect form data
    const form = new FormData(e.target);
    const formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const { fullname, email, password } = formData;

    // Form validation
    if (fullname && fullname.length < 3) {
      return toast.error("Fullname must be at least 3 characters long");
    }
    if (!email) {
      return toast.error("Email must be provided");
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email format");
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be 6-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    // Call server with validated form data
    userAuthThroughServer(serverRoot, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoot ="/google-auth"
        let formData = {
          access_token: user.accessToken 
        }

        userAuthThroughServer(serverRoot,formData);
      })
      .catch((err) => {
        toast.error("Something went wrong with Google authentication");
        console.log(err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <Animationwapper keyvalue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="formElement" className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome back" : "Join us today"}
          </h1>

          {type !== "sign-in" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button className="btn-dark center mt-14" type="submit">
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 mt-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleicon} className="w-5" alt="Google Icon" />
            Continue with Google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </Animationwapper>
  );
};

export default UserAuthForm;
