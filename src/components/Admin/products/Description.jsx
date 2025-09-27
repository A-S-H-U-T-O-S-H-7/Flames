"use client";

import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

export default function Description({ data, handleData }) {
  const editorRef = useRef(null);
  
  const handleChange = (value) => {
    handleData("description", value);
  };
  
  // Save SunEditor instance to ref when it initializes
  const getSunEditorInstance = (sunEditor) => {
    editorRef.current = sunEditor;
  };
  
  // Update editor content when data changes
  useEffect(() => {
    if (editorRef.current && data?.description) {
      editorRef.current.setContents(data.description);
    }
  }, [data?.description]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 bg-white dark:bg-[#0e1726] border border-purple-500 dark:border-[#22c7d5] p-6 rounded-xl h-full shadow-lg transition-all duration-200 ease-in-out"
    >
      <h1 className="font-semibold text-[#212529] dark:text-white text-xl">Description</h1>
      
      <div className="flex-1 transition-all duration-200">
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          onChange={handleChange}
          setContents={data?.description || ""} 
          setOptions={{
            buttonList: [
              ["undo", "redo"],
              ["bold", "italic", "underline", "strike"],
              ["fontSize", "list", "align"],
              ["link", "image", "video"],
              ["removeFormat"],
            ],
            minHeight: "300px",
            height: "auto",
            placeholder: "Enter your description here...",
            width: "100%",
            buttonStyle: "soft",
            toolbarStickyTop: 0,
            attributesWhitelist: {
              all: "style",
            },
            fontSize: [
              8, 10, 12, 14, 16, 18, 20, 24, 28, 36
            ],
            colorList: [
              "#22c7d5", 
              "#1aa5b5", // darker theme color
              "#000000",
              "#666666",
              "#888ea8", // theme text color
              "#ffffff"
            ],
            linkTargetNewWindow: true,
            showPathLabel: false,
            resizingBar: false,
            defaultStyle: `
              font-family: inherit;
              font-size: 14px;
              background-color: transparent;
              color: inherit;
            `,
            katex: false,
          }}
          setDefaultStyle={`
            background-color: ${typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#1e2737' : 'white'};
            border-radius: 0.5rem;
            min-height: 100px;
            padding: 1rem;
            color: ${typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#888ea8' : 'inherit'};
          `}
        />
      </div>
    </motion.section>
  );
}