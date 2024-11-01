import { useState } from "react";

const InputBox = ({name,type,id,value,placeholder,icon}) => {

    const[passwordvisiable, setPasswordvisiable] = useState(false);
     return(
        <div className="relative w-[100%] mb-4">
        <input 
            type={type =="password" ? passwordvisiable ? "text" :  "password" :type}
            name={name}
            id={id}
            placeholder={placeholder}
            defaultValue={value}
            className="input-box"
        />
            <i className={"fi " +icon+ " input-icon"}></i>

            {
                type=="password" ? 
                <i className={"fi fi-rr-eye" +(!passwordvisiable ? "-crossed":"" )+ " input-icon left-[auto] right-4 cursor-pointer"}onClick={()=>setPasswordvisiable(currentVal => !currentVal)}></i>
                :""
            }
            
        </div>
     )
 }

 export default InputBox;