import { port } from "./utils/config.js";
import app from "./app.js";

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
