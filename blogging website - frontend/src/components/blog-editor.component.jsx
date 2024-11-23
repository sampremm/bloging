import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadimg } from "../common/aws";
import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { EditorContex } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";
const BlogEditor = () => {
  let { blog, blog: { title, banner, content,  discription }, setBlog, textEditor, settextEditor,setEditorState } = useContext(EditorContex);

  let {userAuth:{access_token}}=useContext(UserContext);


  let navigate= useNavigate();

  useEffect(() => {
    if(!textEditor.isReady){
      settextEditor(
        new EditorJS({
          holderId: "texteditor",
          data: content,
          tools: tools,
          placeholder: "Type here to write your blog",
        }));      
    }
  }, []);

  const handleChange = (e) => {
    const img = e.target.files[0];

    if (img) {
      const loadingToast = toast.loading("Uploading image...");
      uploadimg(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast); // Dismiss toast using returned ID
            toast.success("Image uploaded 👍🏼");
            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast); // Dismiss toast using returned ID
          toast.error("Failed to upload image");
        });
    }
  };

  const handelkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handelerror = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  const handeltitlechange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setBlog({ ...blog, title: input.value });
  };

  const handlePublish = () => {
    // Validate required fields
    if (!title.length) {
      toast.error("Title is required");
    }
    if (!banner.length) {
      toast.error("Banner is required");
    }
    // Save text editor content 
    if (textEditor.isReady) {
      textEditor.save().then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("Publish");
          } else {
            toast.error("Content is required");
          }
        })
        .catch(() => {
          toast.error("Failed to save content");
        });
    }
  };

  const handelSaveDraft = async (e) => {
    if (e.target.classList.contains("disabled")) return;
  
    if (!title.trim()) {
      return toast.error("Write a title before saving as draft.");
    }
  
    const toastId = toast.loading("Saving Draft...");
    e.target.classList.add("disabled");
  
    try {
      // Ensure text editor is ready and save content
      if (!textEditor.isReady) {
        throw new Error("Text editor is not ready.");
      }
  
      const content = await textEditor.save();
  
      // Prepare blog object
      const blogObj = { title, des, banner, content, draft: true };
  
      // Send data to the server
      await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/createblog`, blogObj, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
  
      // Success feedback
      e.target.classList.remove("disabled");
      toast.dismiss(toastId);
      toast.success("Saved as draft successfully.");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      // Handle errors
      e.target.classList.remove("disabled");
      toast.dismiss(toastId);
  
      if (error.response) {
        // Server error
        toast.error(error.response.data?.error || "Failed to save the draft.");
      } else {
        // General or editor-related error
        toast.error(error.message || "An unexpected error occurred. Please try again.");
      }
    }
  };
  
  
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} /> {/* Ensure Toaster is included */}
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="Logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublish}>
            Publish
          </button>
          <button className="btn-white py-2" onClick={handelSaveDraft}>Save Draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={banner || defaultBanner} // Default banner fallback
                  alt="Blog banner"
                  className="z-20"
                  onError={handelerror}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleChange}
                />
              </label>
            </div>
            <textarea
              defaultValue={title}
              placeholder="blog title"
              className="text-3xl font-medium outline-none w-full h-20 resize-none mt-10 leading-tight placeholder:opacity-50%"
              onKeyDown={handelkeydown}
              onChange={handeltitlechange}
              value={title} 
            />
            <hr className="w-full opacity-10 my-5 "></hr>
            <div id="texteditor" className="font-gelasio "></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
