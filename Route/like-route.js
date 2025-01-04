const Route = require("express");

const postModel = require("../Module/post-schema");
const authMiddleWare = require("../auth-middle-ware");
const likeRoute = Route();

likeRoute.post("/pressLike", authMiddleWare, async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const likedPostResponse = await postModel.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });
    res.status(200).json({ message: userId + "liked post" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

module.exports = likeRoute;
