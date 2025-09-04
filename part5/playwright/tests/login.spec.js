import { test, expect, beforeEach, describe, request } from "@playwright/test";
import { loginWith } from "./helper";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database
    await request.post("http://localhost:3001/api/users/testing/reset");

    // Create a user
    const newUser = {
      name: "Tester",
      username: "tester",
      password: "testpassword",
    };
    await request.post("http://localhost:3001/api/users", {
      data: newUser,
    });

    // Go to the app
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "tester", "testpassword");
      await expect(page.getByText("Tester logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "tester", "wrongpassword");
      await expect(
        page.getByText("Invalid username or password"),
      ).toBeVisible();
      await expect(page.getByText("Tester logged in")).not.toBeVisible();
    });
  });
  describe("When logged in", () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page, "tester", "testpassword");
      await request.post("http://localhost:3001/api/blogs/testing/reset");
    });

    test("A blog can be created", async ({ page }) => {
      await page.getByText("Create New Blog").click();
      await page.getByPlaceholder("Blog Title").fill("My First Blog");
      await page.getByPlaceholder("Blog Author").fill("Example Author");
      await page
        .getByPlaceholder("Blog URL")
        .fill("https://example.com/my-first-blog");
      await page.getByRole("button", { name: "Create" }).click();

      await expect(page.getByTitle(/My First Blog/)).toBeVisible();
      await expect(page.getByTitle(/Example Author/)).toBeVisible();
    });
    test("A blog can be liked", async ({ page }) => {
      // Create a blog first
      await page.getByText("Create New Blog").click();
      await page.getByPlaceholder("Blog Title").fill("My First Blog");
      await page.getByPlaceholder("Blog Author").fill("Example Author");
      await page
        .getByPlaceholder("Blog URL")
        .fill("https://example.com/my-first-blog");
      await page.getByRole("button", { name: "Create" }).click();

      // Like the blog
      await page.getByRole("button", { name: "View" }).click();
      const likeButton = page.getByRole("button", { name: "Like" });
      await likeButton.click();
      await expect(page.getByText("Likes: 1")).toBeVisible();
    });
    test("A blog can be deleted", async ({ page }) => {
      // Create a blog first
      await page.getByText("Create New Blog").click();
      await page.getByPlaceholder("Blog Title").fill("My First Blog");
      await page.getByPlaceholder("Blog Author").fill("Example Author");
      await page
        .getByPlaceholder("Blog URL")
        .fill("https://example.com/my-first-blog");
      await page.getByRole("button", { name: "Create" }).click();

      // Delete the blog
      await page.getByRole("button", { name: "View" }).click();
      await page.getByRole("button", { name: "Remove" }).click();
      page.on("dialog", (dialog) => dialog.accept());
      await expect(page.getByTitle(/My First Blog/)).not.toBeVisible();
    });
    test("Blogs are ordered by likes", async ({ page }) => {
      // Create first blog
      await page.getByText("Create New Blog").click();
      await page.getByPlaceholder("Blog Title").fill("First Blog");
      await page.getByPlaceholder("Blog Author").fill("Author One");
      await page
        .getByPlaceholder("Blog URL")
        .fill("https://example.com/first-blog");
      await page.getByRole("button", { name: "Create" }).click();

      // Create second blog
      await page.getByText("Create New Blog").click();
      await page.getByPlaceholder("Blog Title").fill("Second Blog");
      await page.getByPlaceholder("Blog Author").fill("Author Two");
      await page
        .getByPlaceholder("Blog URL")
        .fill("https://example.com/second-blog");
      await page.getByRole("button", { name: "Create" }).click();

      // Like the second blog twice
      const blogs = page.getByTestId("blog");
      await blogs.nth(1).getByRole("button", { name: "View" }).click();
      const likeButton = blogs.nth(1).getByRole("button", { name: "Like" });
      await likeButton.click();
      await page.waitForTimeout(500); // Wait for the like to be processed
      await likeButton.click();
      await page.waitForTimeout(500); // Wait for the like to be processed

      // Verify the order
      const firstBlogTitle = await blogs
        .nth(0)
        .getByTitle(/Second Blog/)
        .textContent();
      const secondBlogTitle = await blogs
        .nth(1)
        .getByTitle(/First Blog/)
        .textContent();

      expect(firstBlogTitle).toContain("Second Blog");
      expect(secondBlogTitle).toContain("First Blog");
    });
  });
});
