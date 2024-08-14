const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

// Route to create a new product
// router.post('/createProduct', protect, admin, createProduct);

// Route to get all products
// router.get('/getAllProduct', getProducts);

// Route to get a product by ID
// router.get('/:id', getProductById);

// Route to update a product by ID
// router.put('/:id', protect, admin, updateProduct);

// Route to delete a product by ID
// router.delete('/deleteProduct/:id', protect, admin, deleteProduct);

// Route to get products by category ID
router.get('/getProductByCategoryName/:categoryId', getProductsByCategory);

module.exports = router;


//http://localhost:5000/api/products/createProduct
//http://localhost:5000/api/products/updateProduct/:id

//http://localhost:5000/api/products/deleteProduct/:id

//http://localhost:5000/api/products/getAllProduct

//http://localhost:5000/api/products/getProductByCategoryName/:categoryId
