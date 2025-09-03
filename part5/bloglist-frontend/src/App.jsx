import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };
    fetchBlogs();
  }, []);

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setShowForm(false);
      setNotification(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`,
      );
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage("Error creating blog:" + exception.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (exception) {
      setErrorMessage("Error deleting blog:" + exception.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async (username, password) => {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    blogService.setToken(user.token);
    setUser(user);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    blogService.setToken(null);
  };

  const handleLike = async (likedBlog) => {
    try {
      const updatedBlog = {
        ...likedBlog,
        likes: likedBlog.likes + 1,
        user: likedBlog.user.id,
      };
      await blogService.update(likedBlog.id, updatedBlog);
      const updatedBlogWithUser = { ...updatedBlog, user: likedBlog.user };
      setBlogs(
        blogs.map((blog) =>
          blog.id === likedBlog.id ? updatedBlogWithUser : blog,
        ),
      );
    } catch (exception) {
      setErrorMessage("Error liking blog:" + exception.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <h1>Blogs</h1>
      <div>
        {user.name} logged in
        <button
          onClick={handleLogout}
          style={{ fontSize: "1rem", marginLeft: "0.5rem" }}
        >
          Logout
        </button>
      </div>
      <div>
        {notification && <div style={{ color: "green" }}>{notification}</div>}
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </div>
      {showForm ? (
        <div>
          <BlogForm createBlog={createBlog} setShowForm={setShowForm} />
          <button
            onClick={() => setShowForm(false)}
            style={{ margin: "1rem 0" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} style={{ margin: "1rem 0" }}>
          Create new blog
        </button>
      )}
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleDelete={handleDeleteBlog}
          handleLike={handleLike}
        />
      ))}
    </div>
  );
};

export default App;
