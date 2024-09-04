const express = require('express');
const productController = require('../controllers/productController');
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/multer');



const router = express.Router();

// Route to create a new product
router.post('/createProduct', authorize.auth, authorize.admin, upload.single('image'),  productController.createProduct);

// Route to get all products
router.get('/getAllProduct',authorize.auth, productController.getAllProducts);

// Route to get a product by ID
// router.get('/:id', getProductById);

// Route to update a product by ID
router.put('updateProduct/:id', authorize.auth, authorize.admin, productController.updateProduct);

// Route to delete a product by ID
router.delete('/deleteProduct/:id', authorize.auth, authorize.admin, productController.deleteProduct);

// Route to get products by category ID
router.get('/getProductByCategoryName/:categoryId', productController.getProductsByCategory);

module.exports = router;


//http://localhost:5000/api/products/createProduct
//http://localhost:5000/api/products/updateProduct/${product._id}

//http://localhost:5000/api/products/deleteProduct/${product._id}

//http://localhost:5000/api/products/getAllProduct

//http://localhost:5000/api/products/getProductByCategoryName/:categoryId
