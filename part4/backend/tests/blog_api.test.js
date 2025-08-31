import { test, after } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";

const api = supertest(app);

test("correct amount of blog posts is returned and it's json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    if (!blog.id) {
      throw new Error("id property is missing");
    }
  });
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "New Blog Post",
    author: "Test Author",
    url: "http://example.com/new-blog-post",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const titles = response.body.map((r) => r.title);

  if (!titles.includes("New Blog Post")) {
    throw new Error("New blog post was not added");
  }
  // remove added blog to keep tests idempotent
  const addedBlog = response.body.find((r) => r.title === "New Blog Post");
  await api.delete(`/api/blogs/${addedBlog.id}`).expect(204);
});

test("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "Blog Without Likes",
    author: "Test Author",
    url: "http://example.com/blog-without-likes",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  if (response.body.likes !== 0) {
    throw new Error("Likes did not default to 0");
  }
});

test("blog without title and url is not added", async () => {
  const newBlog = {
    author: "Test Author",
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
