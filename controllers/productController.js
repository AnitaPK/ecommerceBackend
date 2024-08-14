const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, availability, quantity } = req.body;

        // Check if the product already exists (optional)
        let product = await Product.findOne({ name });
        if (product) {
            return res.status(400).json({ msg: 'Product already exists' });
        }

        // Create a new product instance
        product = new Product({
            name,
            category,
            price,
            availability,
            quantity,
            createdBy: req.user.id,
        });

        // Save the product to the database
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
    try {
        const { name, category, price, availability, quantity } = req.body;

        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.availability = availability !== undefined ? availability : product.availability;
        product.quantity = quantity || product.quantity;

        await product.save();
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await product.remove();
        res.status(200).json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryId }).populate('category');
        if (!products) {
            return res.status(404).json({ msg: 'No products found for this category' });
        }
        res.status(200).json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
