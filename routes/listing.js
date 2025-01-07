const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../utils/middleware.js");
const {
  index,
  renderNewForm,
  updatedListing,
  renderUpdateForm,
  destroyListing,
  displayListing,
  createListing,
} = require("../controllers/listing.js");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createListing)
  );

router.get("/create", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(displayListing))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(updatedListing))
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

router.get("/:id/update", isLoggedIn, isOwner, wrapAsync(renderUpdateForm));

module.exports = router;
