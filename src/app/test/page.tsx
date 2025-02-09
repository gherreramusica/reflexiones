"use client";
import { useState } from "react";

export default function NumerosList() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<string[]>([]);

  const handleSubmit = () => {
    if (content.trim() !== "") {
      setPosts((prevPosts) => [...prevPosts, content.trim()]);
      setContent("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
   if(e.key === 'Enter'){
      handleSubmit();
   }
  }

  return (
    <div className="p-4 bg-gray-50">
      <div className="p-4 max-w-sm mx-auto bg-white shadow-md rounded-lg mt-10">
        <input
          placeholder="Whats Up?"
          type="text"
          value={content}
          name=""
          id=""
          onChange={(e) => setContent(e.target.value)}
          className="outline-none"
          onKeyDown={handleKeyPress}
        />
      </div>
      <div className="max-w-sm mx-auto border p-4 mt-5 bg-blue-500 text-white rounded-md text-center">
        <button onClick={handleSubmit}>Publicar</button>
      </div>
      <div className="mt-10 w-full max-w-sm mx-auto">
        <ul className=" w-full">
          {posts.map((post, index) => (
            <li
              key={index}
              className="border p-4 mb-5 rounded-md bg-white shadow-md m-auto"
            >
              {post}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
