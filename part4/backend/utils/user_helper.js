export const nonExistingUser = {
  username: "willremovethissoon",
  name: "Will Remove",
  password: "password123",
};

export const initialUsers = [
  {
    username: "alice",
    name: "Alice Wonderland",
    password: "alicepassword",
  },
  {
    username: "bob",
    name: "Bob Builder",
    password: "bobpassword",
  },
];

export const usersInDb = async (User) => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

export const findUserByUsername = async (User, username) => {
  const user = await User.findOne({ username });
  return user ? user.toJSON() : null;
};

export const findUserById = async (User, id) => {
  const user = await User.findById(id);
  return user ? user.toJSON() : null;
};
