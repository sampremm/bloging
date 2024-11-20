import React, { useContext } from "react";
import Animationwapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { EditorContex } from "../pages/editor.pages";
import Tag from "./tags.component";

const PublishForm = () => {
  const { blog, blog: { banner, title, tages, discription }, setEditorState,setBlog  } = useContext(EditorContex);
let charlimt=500; 
  const handleCloseEvent = () => {
    if (setEditorState) {
      setEditorState("editor");
      toast.success("Returning to editor.");
    } else {
      toast.error("Context is not available.");
    }
  };
  const handelinput = (e) => {
     let input = e.target;

     setBlog({...blog,title:input.value})
  };

  const handelblogchange =(e)=>{
    let input = e.target;

    setBlog({...blog,discription:input.value})
  }
  const handelkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  return (
    <Animationwapper>
      <section className="w-screen min-h-screen grid items-center  lg:grid-cols-2 py-16 lg:gap-4 ">
        {/* Place the Toaster for notifications */}
        <Toaster reverseOrder={false} />

        {/* Close button with accessibility improvements */}
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
            <img src={banner}/>
          </div>

          <h1 className="font-medium text-4xl mt-2 leading-tight line-clamp-1">{title}</h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4 ">{discription}</p>
        </div>

        <div className="boder-grey lg:bodder-1 lg:pl-8">

        <p className="text-dark-grey mb-2 mt-9">blog title</p>
          <input type="text" placeholder="blog title" 
            defaultValue={title} className="input-box pl-4"
            onClick={handelinput}

          />
          <p className="text-dark-grey mb-2 mt-9">short discription</p>
          <input type="text" placeholder="blog title" 
          

          /> 
           <textarea maxLength={charlimt} 
           defaultValue={discription}
           className="h-40 resize-none leading-7 input-box pl-4 "
           onChange={handelblogchange}
           onKeyDown={handelkeydown}
           > 
          </textarea>

          <p className="mt-1 tetx-dark-grey text-sm text-right">{charlimt - discription.length} characters left</p>

          <p className="text-dark-grey mb-2 mt-9">Topics-(helps in scearching and ranking the post)</p>

          <div className="realative input-box pl-2 py-2 pb-4 ">
          <input type="text" placeholder="topic" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus-bg-white " />
          {tages}
          </div>

        </div>
      </section>
    </Animationwapper>
  );
};

export default PublishForm;
