const express = require('express');
const router = express.Router();
const { 
    addItemToCart, 
    deleteItemFromCart, 
    emptyCart, 
    getAllCartItems,
    updateQuantity 
} = require('../controllers/cartController');
const authorize = require('../middlewares/authorize');


router.post('/addToCart', authorize.auth, addItemToCart);
router.delete('/deleteItemFromCart/:productId', authorize.auth, deleteItemFromCart);
router.delete('/emptyCart', authorize.auth, emptyCart);
router.get('/getAllCart', authorize.auth, getAllCartItems);
router.put('/updateQuantity', authorize.auth, updateQuantity); 

module.exports = router;
