import mongoose from "mongoose";
const { Schema } = mongoose;

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>",
  );
  process.exit(1);
}

const password = process.argv[2];

// MongoDB connection URL using the provided password
const url = `mongodb+srv://jackvalley:${password}@cluster1.1udrd.mongodb.net/fso?retryWrites=true&w=majority&appName=Cluster1`;

mongoose.set("strictQuery", false);

const personSchema = new Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Add a new person (if 5 arguments were given: node, script, password, name, number)
    if (process.argv.length === 5) {
      const name = process.argv[3];
      const number = process.argv[4];

      const person = new Person({
        name: name,
        number: number,
      });

      // Save the new person and handle success/error
      try {
        await person.save();
        console.log(`added ${name} number ${number} to phonebook`);
      } catch (error) {
        console.error("Error saving person:", error);
      }
    }
    // List all people (if only 3 arguments were given: node, script, password)
    else if (process.argv.length === 3) {
      console.log("phonebook:");
      // Find all persons and handle success/error
      try {
        const persons = await Person.find({});
        persons.forEach((person_1) => {
          console.log(`${person_1.name} ${person_1.number}`);
        });
      } catch (error_1) {
        console.error("Error fetching persons:", error_1);
      }
    }
    // Incorrect number of arguments (other than 3 or 5)
    else {
      console.log("Incorrect number of arguments.");
      console.log("To add a person: node mongo.js <password> <name> <number>");
      console.log("To list all persons: node mongo.js <password>");
      return Promise.resolve();
    }
  })
  .then(() => {
    // Closing the connection after succesful/failed operation is done
    console.log("Closing MongoDB connection");
    return mongoose.connection.close();
  })
  .catch((err) => {
    // Handling initial connection errors
    console.error("Connection error:", err);
    process.exit(1);
  });
