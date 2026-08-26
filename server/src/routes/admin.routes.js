const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const {
  questionAdminSchema,
  categoryAdminSchema,
  jobRoleAdminSchema,
  promptAdminSchema
} = require('../validators/admin.validator');

// Strict Admin Gatekeeper: Must be Authenticated AND role === 'admin'
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard
router.get('/dashboard', adminController.getAdminDashboard);

// User Management
router.get('/users', adminController.getAdminUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Question Bank CRUD
router.get('/questions', adminController.getAdminQuestions);
router.post('/questions', validate(questionAdminSchema), adminController.createQuestion);
router.put('/questions/:id', validate(questionAdminSchema), adminController.updateQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);

// Category Management CRUD
router.get('/categories', adminController.getAdminCategories);
router.post('/categories', validate(categoryAdminSchema), adminController.createCategory);
router.put('/categories/:id', validate(categoryAdminSchema), adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Job Role Management CRUD
router.get('/job-roles', adminController.getAdminJobRoles);
router.post('/job-roles', validate(jobRoleAdminSchema), adminController.createJobRole);
router.put('/job-roles/:id', validate(jobRoleAdminSchema), adminController.updateJobRole);
router.delete('/job-roles/:id', adminController.deleteJobRole);

// AI Prompt Management
router.get('/prompts', adminController.getAdminPrompts);
router.post('/prompts', validate(promptAdminSchema), adminController.createPromptVersion);
router.put('/prompts/:id', adminController.updatePrompt);

module.exports = router;
