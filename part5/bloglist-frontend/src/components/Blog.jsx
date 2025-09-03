import { useState } from "react";

const Blog = ({ blog, handleDelete, handleLike }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const confirmAndDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      handleDelete(blog.id);
    }
  };

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "0 0 0 1rem",
        marginBottom: "5px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <p style={{ fontWeight: "Bold" }}>Title:</p> {blog.title}
        <p style={{ fontWeight: "Bold" }}>Author:</p> {blog.author}
        <button onClick={toggleVisibility}>{visible ? "Hide" : "View"}</button>
      </div>
      <div style={{ display: visible ? "" : "none", marginTop: "0.5rem" }}>
        <p>
          <span style={{ fontWeight: "Bold" }}>URL:</span> {blog.url}
        </p>
        <p>
          <span style={{ fontWeight: "Bold" }}>Likes:</span> {blog.likes}
          <button
            style={{ marginLeft: "0.5rem" }}
            onClick={() => handleLike(blog)}
          >
            Like
          </button>
        </p>
        <p>
          <span style={{ fontWeight: "Bold" }}>User:</span> {blog.user.name}
        </p>
        <button onClick={confirmAndDelete} style={{ margin: "1rem 0" }}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
