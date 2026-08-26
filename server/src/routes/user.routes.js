const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema, changePasswordSchema } = require('../validators/user.validator');

router.use(protect);

router.get('/me', userController.getUserProfile);
router.put('/me', validate(updateProfileSchema), userController.updateUserProfile);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);
router.delete('/me', userController.deleteMyAccount);

module.exports = router;
