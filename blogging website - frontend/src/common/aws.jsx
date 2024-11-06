import axios from "axios";

export const uploadimg = async (img) => {
    let imgurl = null;

    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/uploadurl")
    .then(async ({data: { uploadURL }}) => {

       await axios({
            method: "PUT",
            url: uploadURL,
            headers:{'content-type': 'multipart/form-data'},
            data: img
        })
        .then(()=>{
            imgurl = uploadURL.split("?")[0];
        })
        
    })

    return imgurl;
}
