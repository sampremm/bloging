import React, { createContext, useContext, useState } from 'react';
import { UserContext } from '../App';
import { Navigate } from 'react-router-dom';
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';


const blogstructure = {
    title:'',
    banner:'',
    content:[],
    des:'',
    author: { personal_info:[]}
}
export const EditorContex= createContext({})

 
const Editor = () => {

    const [blog,setBlog]=useState(blogstructure)
    const [editorState, setEditorState] = useState("editor");
    const [textEditor, settextEditor] = useState({isReady: false});

    let { userAuth: { access_token } } = useContext(UserContext);
    return (
        <EditorContex.Provider value={{blog,setBlog,setEditorState,editorState,textEditor,settextEditor}}>
     {  access_token == null 
        ? <Navigate to="/signin"/> : editorState == "editor" ? <BlogEditor/> : <PublishForm/>}
        </EditorContex.Provider>
    
    );
};

export default Editor;
