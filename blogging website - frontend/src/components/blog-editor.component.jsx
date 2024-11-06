import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadimg } from "../common/aws";
import { useRef } from "react";

const BlogEditor = () => {
  const blogBannerRef = useRef();

  const handleChange = (e) => {
    const img = e.target.files[0];
    
    if (img) {
      uploadimg(img).then((url) => {
        if (url) {
          blogBannerRef.current.src = url;
        }
      });
    }
  };
  
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="Logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          New Blog
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-white py-2">Save Draft</button>
        </div>
      </nav>
      
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img 
                  src={defaultBanner}
                  ref={blogBannerRef}
                  alt="Blog banner"
                  className="z-20"
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
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
