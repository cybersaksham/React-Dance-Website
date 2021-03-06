const connectToMongo = require("./db");
const express = require("express");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const Contact = require("./Models/Contact");

// Connecting to database
connectToMongo();

// App
const app = express();
const port = 5000;

// Enabling CORS
app.use(cors());

// To use json bundles
app.use(express.json());

// Routes
app.post(
  "/contact",
  [
    // Validators
    body("name", "Name must be 3 characters long.").isLength({ min: 3 }),
    body("email", "Enter correct email").isEmail(),
    body("message", "Message must be 20 characters long.").isLength({
      min: 20,
    }),
  ],
  async (req, res) => {
    // Sending error if validator failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      // Creating Contact
      const contact = new Contact(req.body);

      // Saving Contact
      const savedContact = await contact.save();

      return res.json(savedContact);
    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Listening
app.listen(port, () => {
  console.log(`Dance website listening at http://localhost:${port}`);
});
