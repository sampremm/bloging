// import { useContext } from "react";
// import { EditorContex } from "../pages/editor.pages";

// const Tag = ({ tag }) => {
//   const { blogs, setBlogs } = useContext(EditorContex); // Access both blogs and setBlogs
//   const { tages } = blogs;

//   const handleButtonClick = () => {
//     const updatedTags = tages.filter(t => t !== tag); // Filter out the clicked tag
//     setBlogs({ ...blogs, tages: updatedTags }); // Update the state in the context provider
//   };

//   return (
//     <div className="relative cursor-pointer p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
//       <p className="outline-none">{tag}</p> {/* Removed contentEditable */}
      
//       <button 
//         aria-label="Remove tag"
//         className="mt-1.5 rounded-full absolute right-3 top-1/2 -translate-y-1/2"
//         onClick={handleButtonClick}
//       >
//         <i className="fi fi-rr-cross text-2xl"></i> {/* Corrected icon size and positioning */}
//       </button>
//     </div>
//   );
// };

// export default Tag;
