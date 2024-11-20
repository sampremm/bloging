const Tag = ({ tag }) => {
    return(
            <div className="relative cursor-pointer p-2 mt-2 mr-2 px-5  bg-white rounded-full inline-block hover:bg-opacity-50 pr-10 ">
                <p className="outline-none " contentEditable="true">{tag}</p>
                <button className="mt-2px rounded-full absolute right-3 top-1/2 -translate-y-1/2">
                <i className="fi fi-rr-cross text-5m pointer-events-none"></i>
                </button>
            </div>
    )
}
export default Tag;