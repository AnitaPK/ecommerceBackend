const express = require('express');
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

// Route to create a new category
// router.post('/createCategory', protect, admin, createCategory);

// Route to get all categories
// router.get('/getAllCategory', getCategories);

// Route to update a category by ID
// router.put('/updateCategory/:id', protect, admin, updateCategory);

// Route to delete a category by ID
// router.delete('/deleteCategory/:id', protect, admin, deleteCategory);

module.exports = router;




//http://localhost:5000/api/categories/createCategory
//http://localhost:5000/api/categories/updateCategory
//http://localhost:5000/api/categories/deleteCategory
//http://localhost:5000/api/categories/getAllCategory
