const { mongoose } = require("mongoose");
const express = require("express");
const userModel = require("./Module/user-schema");
const postRoute = require("./Route/post-route");
const app = express();
const userRoute = require("./Route/user-route");
const commentRoute = require("./Route/comment-route");
const likeRoute = require("./Route/like-route");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDataBase = async () => {
  console.log("call connect db");
  try {
    const res = await mongoose.connect(
      "mongodb+srv://inguuninguun7:Pinecone123@cluster0.iy551.mongodb.net/instagram?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("DB connected");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
dotenv.config();
connectDataBase();
app.use(cors());
app.use(express.json());
app.use(userRoute);
app.use(postRoute);
app.use(likeRoute);
app.use(commentRoute);

app.get("/", async (req, res) => {
  res.send("working");
});

app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    await userModel.create(user);
    res.send("User created successfully");
  } catch (error) {
    console.error(error);
    res.send("Failed to sign up");
  }
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
