import React, { useContext } from "react";
import Animationwapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { EditorContex } from "../pages/editor.pages";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
  const charLimit = 500;
  const {
    blog,
    blog: { banner = "", title = "", des = "", content = {} } = {},
    setEditorState,
    setBlog,
  } = useContext(EditorContex);
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCloseEvent = () => {
    if (setEditorState) {
      setEditorState("editor");
      toast.success("Returning to editor.");
    } else {
      toast.error("Context is not available.");
    }
  };

  const handleInput = (e) => {
    if (setBlog) {
      setBlog({ ...blog, title: e.target.value });
    }
  };

  const handleBlogChange = (e) => {
    if (setBlog) {
      setBlog({ ...blog, des: e.target.value });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const handlePublishEvent = (e) => {
    if (e.target.classList.contains("disabled"))
       return;

    if (!title.trim()) {
      return toast.error("Write a blog title.");
    }

    if (!des.trim() || des.length > charLimit) {
      return toast.error(`Write a blog description within ${charLimit} characters.`);
    }

    const toastId = toast.loading("Publishing...");
    e.target.classList.add("disabled");

    const blogObj = { title: title.trim(), des: des.trim(), banner, content , draft: false };

    axios
      .post(`${import.meta.env.VITE_SERVER_DOMAIN}/createblog`, blogObj, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then(() => {
        e.target.classList.remove("disabled");
        toast.dismiss(toastId);
        toast.success("Blog published successfully.");
        setTimeout(() => navigate("/"), 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disabled");
        toast.dismiss(toastId);
        toast.error(response?.data?.error || "Failed to publish the blog.");
      });
  };

  return (
    <Animationwapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster reverseOrder={false} />

        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
          aria-label="Close Publish Form"
          title="Close Publish Form"
        >
          <i className="fi fi-rr-cross"></i>
        </button>

        <div className="max-w-[500px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} alt="Banner" />
          </div>
          <h1 className="font-medium text-4xl mt-2 leading-tight line-clamp-1">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            className="input-box pl-4"
            onChange={handleInput}
          />
          <p className="text-dark-grey mb-2 mt-9">Short Description</p>
          <textarea
            maxLength={charLimit}
            placeholder="Short Description"
            value={des}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleBlogChange}
            onKeyDown={handleKeyDown}
          />
          <p className="mt-1 text-dark-grey text-sm text-right">
            {charLimit - des.length} characters left
          </p>
          <button className="btn-dark px-8" onClick={handlePublishEvent}>
            Publish
          </button>
        </div>
      </section>
    </Animationwapper>
  );
};

export default PublishForm;
