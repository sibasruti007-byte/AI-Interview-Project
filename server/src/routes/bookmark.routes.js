const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createBookmarkSchema, updateBookmarkSchema } = require('../validators/bookmark.validator');

router.use(protect);

router.get('/', bookmarkController.getBookmarks);
router.post('/', validate(createBookmarkSchema), bookmarkController.addBookmark);
router.put('/:id', validate(updateBookmarkSchema), bookmarkController.updateBookmark);
router.delete('/:id', bookmarkController.deleteBookmark);

module.exports = router;
