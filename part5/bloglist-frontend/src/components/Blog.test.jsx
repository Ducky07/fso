import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import { test, expect, describe } from "vitest";

describe("<Blog />", () => {
  const blog = {
    title: "Evolution of Ants",
    author: "John Doe",
    url: "https://example.com/react-testing",
    likes: 10,
    user: {
      username: "janedoe",
      name: "Jane Doe",
      id: "12345",
    },
  };

  test("renders title and author, but not url or likes by default", () => {
    render(<Blog blog={blog} handleLike={() => {}} />);

    // Title and author are shown
    expect(screen.getByText(/Evolution of Ants/)).toBeInTheDocument();
    expect(screen.getByText(/Evolution of Ants/)).toBeInTheDocument();

    // URL and likes are NOT shown
    expect(
      screen.queryByText("https://example.com/react-testing"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Likes:")).not.toBeInTheDocument();
  });
  test("shows url and likes when the view button is clicked", async () => {
    const user = userEvent.setup();
    render(<Blog blog={blog} handleLike={() => {}} />);

    const button = screen.getByText("View");
    await user.click(button);

    // URL and likes are shown
    expect(
      screen.getByText("https://example.com/react-testing"),
    ).toBeInTheDocument();
    expect(screen.getByText("Likes:")).toBeInTheDocument();
  });
  test("calls the like handler twice when the like button is clicked twice", async () => {
    const user = userEvent.setup();
    const mockHandler = vi.fn();
    render(<Blog blog={blog} handleLike={mockHandler} />);

    const viewButton = screen.getByText("View");
    await user.click(viewButton);

    const likeButton = screen.getByText("Like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
