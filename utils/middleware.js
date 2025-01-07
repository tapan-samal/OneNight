const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../schema");
const ExpressError = require("./ExpressError.js");

// Validate listing data using Joi schema
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.listing);
  if (error) {
    let errorMsg = error.details.map((err) => err.message).join(", ");
    return next(new ExpressError(400, errorMsg));
  }
  next();
};

// Validate review data using Joi schema
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    let errorMsg = error.details.map((err) => err.message).join(", ");
    return next(new ExpressError(400, errorMsg));
  }
  next();
};

// Check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //save the original URL
    req.flash("error", "You must be logged in to access this page!");
    return res.redirect("/login");
  }
  next();
};

// Save the redirect URL in res.locals for use in views
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

// Check if the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not authorized to modify this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not authorized to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
