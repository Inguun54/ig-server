const Route = require("express");
const commentModel = require("../Module/comment-schema");
const postModel = require("../Module/post-schema");
const authMiddleWare = require("../auth-middle-ware");

const commentRoute = Route();

commentRoute.post("/writeComment", authMiddleWare, async (req, res) => {
  try {
    const { comment, postId, userId } = req.body;

    const newComment = await commentModel.create({
      comment,
      postId,
      userId,
    });

    await postModel.findByIdAndUpdate(postId, {
      $addToSet: newComment._id,
    });

    res.status(200).json(respond);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

commentRoute.get("/getComments/:postId", authMiddleWare, async (req, res) => {
  const { postId } = req.params;
  try {
    const response = await commentModel.find({ postId }).populate("userId");
    return res.send(response);
  } catch (error) {
    throw new Error("Failed to get comments");
  }
});

module.exports = commentRoute;
