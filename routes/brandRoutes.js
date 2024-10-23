const express = require('express');
const {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
} = require('../controllers/brandController');
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/multer');


const router = express.Router();

router.post('/createBrand', authorize.auth, authorize.admin, upload.single('image'), createBrand);

router.get('/getAllBrand', getBrands);

router.put('/updateBrand/:id', authorize.auth, authorize.admin, updateBrand);

router.delete('/deleteBrand/:id', authorize.auth, authorize.admin, deleteBrand);

module.exports = router;
