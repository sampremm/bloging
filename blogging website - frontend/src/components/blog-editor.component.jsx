import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import Animationwapper from "../common/page-animation";

const BlogEditor = () => {
  return (
    <>
      <nav className='navbar'>
    <Link to="/" className="felx-none w-10">
        <img src={logo} alt="Logo"></img>
    </Link>
    <p className="max-md:hidden text-black line-clamp-1 w-full ">
      New blog
    </p>
    <div className="flex  gap-4 ml-auto ">
      <button className="btn-dark py-2">
          publish
      </button>
      <button className="btn-white py-2">
            save draft
      </button>
    </div>


      </nav>
      <Animationwapper>
      <section>
        <div className="mx-auto mx-w-[900px] w-full">
          <div className="relative aspect-video hover:opacity-80 bg-white  border-4 border-grey"> 
            <label htmlFor="uploadbanner">
              <input id="uploadbanner"
                      type="file "
                      accept=".png, .jpg, .jpeg"
                      hidden
              /> 
            </label>
          </div>
        </div>
      </section>
      </Animationwapper>
    </>
   
  )
}

export default BlogEditor;