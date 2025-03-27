const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  saveArticle,
  deleteArticle,
  getSavedArticles,
} = require("../controllers/articles");

router.get("/", auth, getSavedArticles);

router.post("/", auth, saveArticle);

router.delete("/:articleId", auth, deleteArticle);

module.exports = router;
