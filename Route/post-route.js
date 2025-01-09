const Route = require("express");
const postModel = require("../Module/post-schema");
const userModel = require("../Module/user-schema");
const commentModel = require("../Module/comment-schema");
const authMiddleWare = require("../auth-middle-ware");
const postRoute = Route();

postRoute.post("/writeComment", authMiddleWare, async (req, res) => {
  try {
    const { comment, postId, userId, username } = req.body;

    const { _id } = await commentModel.create({
      comment,
      postId,
      userId,
      username,
    });

    const respond = await commentModel.findById(_id).populate("userId");

    res.status(200).json(respond);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

postRoute.post("/postcreate", authMiddleWare, async (req, res) => {
  const { caption, postImage, userId } = req.body;
  try {
    const createdPost = await postModel.create({
      caption,
      postImage,
      userId,
    });
    await userModel.findByIdAndUpdate(userId, {
      $push: {
        posts: createdPost._id,
      },
    });
    res.status(200).json(createdPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

postRoute.get("/posts", authMiddleWare, async (req, res) => {
  const authHeader = req.headers("authorization");
  if (!token) res.json({ message: "no token in header" });
  const token = authHeader.split(" ")[1];

  try {
    const posts = await postModel.find().populate("userId");
    res.json(posts);
  } catch (error) {
    res.status(404).json({ message: `failed to get posts, ${error}` });
  }
});

postRoute.get("/post", authMiddleWare, async (req, res) => {
  const posts = await postModel
    .find()
    .populate("userId", "email username _id profileImage");

  return res.json({ posts });
});
postRoute.get("/post/:postId", authMiddleWare, async (req, res) => {
  const { postId } = req.query;
  const response = await postModel.find({ _id: postId }).populate({
    path: "comments",
    populate: {
      path: "userId",
      select: "username profileImage",
    },
  });
  res.send(response);
});

module.exports = postRoute;
