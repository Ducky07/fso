import { useState } from "react";

const BlogForm = ({ createBlog, closeForm }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      console.error("Invalid URL:", error);
      return false;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (closeForm) closeForm();
    if (!title || !author || !url) {
      setErrorMessage("Title, author, and URL are required.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return;
    }
    if (!validateUrl(url)) {
      setErrorMessage("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    if (title.trim().length < 3) {
      setErrorMessage("Title must be at least 3 characters long");
      return;
    }
    setErrorMessage(null);
    createBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "1rem",
          display: "flex",
          flexDirection: "column",
          maxWidth: "300px",
        }}
      >
        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          Title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          Author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          URL:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" style={{ padding: "1rem", fontSize: "1rem" }}>
          Create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
