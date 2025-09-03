import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { test, expect, describe } from "vitest";

describe("<BlogForm />", () => {
  test("calls createBlog with the right details when a new blog is created", async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn();

    render(<BlogForm createBlog={mockHandler} />);

    const titleInput = screen.getByPlaceholderText("Blog Title");
    const authorInput = screen.getByPlaceholderText("Blog Author");
    const urlInput = screen.getByPlaceholderText("Blog URL");
    const submitButton = screen.getByText("Create");

    await user.type(titleInput, "Testing React Forms");
    await user.type(authorInput, "Jane Doe");
    await user.type(urlInput, "https://example.com/react-forms");
    await user.click(submitButton);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0].title).toBe("Testing React Forms");
    expect(mockHandler.mock.calls[0][0].author).toBe("Jane Doe");
    expect(mockHandler.mock.calls[0][0].url).toBe(
      "https://example.com/react-forms",
    );
  });
});
