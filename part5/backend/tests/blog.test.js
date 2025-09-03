import { test, describe } from "node:test";
import { strictEqual } from "node:assert";
import {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} from "../utils/list_helper.js";

describe("dummy function", () =>
  test("dummy test, returns one", () => {
    const blogs = [];

    const result = dummy(blogs);
    strictEqual(result, 1);
  }));

// totalLikes
describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];
  test("when list has only one blog, equals the likes of that", () => {
    const result = totalLikes(listWithOneBlog);
    strictEqual(result, 5);
  });
});

// favoriteBlog
describe("favorite blog", () => {
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    },
  ];

  test("of a bigger list is calculated right", () => {
    const result = favoriteBlog(blogs);
    strictEqual(result.title, "Canonical string reduction");
    strictEqual(result.author, "Edsger W. Dijkstra");
    strictEqual(result.likes, 12);
  });

  test("of empty list is null", () => {
    const result = favoriteBlog([]);
    strictEqual(result, null);
  });
});

// mostBlogs
describe("most blogs", () => {
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
    },
  ];

  test("of a bigger list is calculated right", () => {
    const result = mostBlogs(blogs);
    strictEqual(result.author, "Edsger W. Dijkstra");
    strictEqual(result.blogs, 2);
  });

  test("of empty list is null", () => {
    const result = mostBlogs([]);
    strictEqual(result, null);
  });
});
// mostLikes
describe("most likes", () => {
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
    },
  ];

  test("of a bigger list is calculated right", () => {
    const result = mostLikes(blogs);
    strictEqual(result.author, "Edsger W. Dijkstra");
    strictEqual(result.likes, 17);
  });

  test("of empty list is null", () => {
    const result = mostLikes([]);
    strictEqual(result, null);
  });
});
