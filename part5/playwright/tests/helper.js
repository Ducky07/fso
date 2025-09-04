export const loginWith = async (page, username, password) => {
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};
