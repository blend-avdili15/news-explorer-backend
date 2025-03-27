const Article = require("../models/article");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");

const saveArticle = (req, res, next) => {
  const { title, description, url, urlToImage, source, keyword, publishedAt } =
    req.body;

  Article.findOne({ url })
    .then((existingArticle) => {
      if (existingArticle) {
        return User.findByIdAndUpdate(
          req.user._id,
          { $addToSet: { savedArticles: existingArticle._id } },
          { new: true }
        ).then(() => res.status(200).send(existingArticle));
      }

      return Article.create({
        title,
        description,
        url,
        urlToImage,
        source,
        keyword,
        publishedAt,
        owner: req.user._id,
      }).then((newArticle) => {
        return User.findByIdAndUpdate(
          req.user._id,
          { $addToSet: { savedArticles: newArticle._id } },
          { new: true }
        ).then(() => res.status(201).send(newArticle));
      });
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const articleId = req.params.articleId;

  Article.findOne({ _id: articleId })
    .then((article) => {
      if (!article) {
        throw new NotFoundError("Article not found");
      }

      if (!article.owner.equals(req.user._id)) {
        return res
          .status(403)
          .send({ message: "You are not authorized to delete this article" });
      }

      return Article.findByIdAndDelete(articleId).then(() =>
        res.send({ message: "Article deleted successfully" })
      );
    })
    .catch(next);
};

const getSavedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports = {
  saveArticle,
  deleteArticle,
  getSavedArticles,
};
