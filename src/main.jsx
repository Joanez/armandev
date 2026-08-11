import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Posts from "./pages/Posts.jsx";
import Post from "./pages/Post.jsx";
import Category from "./pages/Category.jsx";
import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post/:slug" element={<Post />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);