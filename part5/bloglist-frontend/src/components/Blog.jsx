const Blog = ({ blog, handleDelete }) => {
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
        <button onClick={confirmAndDelete}>Remove</button>
      </div>
    </div>
  );
};

export default Blog;
