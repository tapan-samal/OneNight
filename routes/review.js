const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../utils/middleware");
const { createReview, destroyReview } = require("../controllers/review");
const router = express.Router({ mergeParams: true });

// Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(destroyReview));

module.exports = router;
