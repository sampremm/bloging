import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import Marker from "@editorjs/marker";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import { uploadimg } from "../common/aws";

const uploadImageFile = async (file) => {
  try {
    const url = await uploadimg(file);
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    } else {
      throw new Error("Failed to upload file, no URL returned.");
    }
  } catch (err) {
    console.error("Error uploading image file:", err);
    return {
      success: 0,
      message: "Image upload failed.",
    };
  }
};

const uploadImageByUrl = async (url) => {
  try {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided.");
    }
    return {
      success: 1,
      file: { url },
    };
  } catch (err) {
    console.error("Error uploading image by URL:", err);
    return {
      success: 0,
      message: "Invalid or failed URL upload.",
    };
  }
};

export const tools = {
  embed: Embed,
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading...",
      levels: [2, 3], // Supported heading levels: <h2>, <h3>
      defaultLevel: 2, // Default heading level: <h2>
    },
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: uploadImageFile, // Handles file uploads
        uploadByUrl: uploadImageByUrl, // Handles URL-based uploads
      },
    },
  },
  marker: Marker, // Text highlighting tool
  list: {
    class: List,
    inlineToolbar: true, // Enable inline editing for list items
  },
  quote: Quote, // Tool for adding quotes
  inlineCode: InlineCode, // Inline code styling
};
