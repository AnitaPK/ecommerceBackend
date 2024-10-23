const Product = require('../models/product');


// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name,brand, category,description, price, availability, quantity } = req.body;
        const image = req.file ? req.file.filename : null; 
        // console.log(req.body);
        // console.log(req.file);
        // Check if the product already exists (optional)
        let product = await Product.findOne({ name });
        if (product) {
            return res.status(400).json({ msg: 'Product already exists' });
        }

        // Create a new product instance
        product = new Product({
            name,
            description,
            image,
            category,
            brand,
            price,
            availability,
            quantity,
            createdBy: req.user.id,
        });
        console.log(product);
        // Save the product to the database
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        // Populate category and brand fields
        const products = await Product.find()
            .populate('category', 'name') 
            .populate('brand', 'name');   

        const modifiedProducts = products.map(product => ({
            id: product._id,
            name: product.name,
            description: product.description,
            productImage: product.image ? `http://localhost:5000/uploads/${product.image}` : null,
            category: product.category, 
            brand: product.brand,       
            price: product.price,
            availability: product.available ? 'InStock' : 'OutOfStock',
            quantity: product.quantity,
        }));

        res.status(200).send(modifiedProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name') 
            .populate('createdBy', 'username'); 

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const modifiedProduct = {
            id: product._id,
            name:product.name,
            productImage: product.image ? `http://localhost:5000/uploads/${product.image}` : null,
            category:product.category,
            price:product.price,
            availability:product.available ? 'InStock' : 'OutOfStock',
            quantity:product.quantity,
            }
        res.status(200).json(modifiedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductsByCategoryAndBrand = async (req, res) => {
    console.log(req.query);
    const { categoryId, brandId } = req.query; 
  
    try {
      // Finding products by category and brand
      const products = await Product.find({
        category: categoryId,
        brand: brandId,
      }).populate('brand category'); 
      
      const modifiedProducts = products.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        productImage: product.image ? `http://localhost:5000/uploads/${product.image}` : null,
        category: product.category, 
        brand: product.brand,       
        price: product.price,
        availability: product.available ? 'InStock' : 'OutOfStock',
        quantity: product.quantity,
    }));
      return res.status(200).json({
        success: true,
        modifiedProducts: modifiedProducts,
      });
    } catch (error) {
      console.error("Error fetching products: ", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching products",
      });
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
    const { id } = req.params;
    try {
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await product.deleteOne({_id: id});
        res.status(200).json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    console.log(req.params);
    try {
      const products = await Product.find({ category: categoryId }).populate('category', 'name').populate('brand', 'name'); 
      if (!products) {
        return res.status(404).json({ msg: 'No products found for this category' });
    }
      

        const modifiedProducts = products.map(product => ({
            id: product._id,
            name: product.name,
            description: product.description,
            productImage: product.image ? `http://localhost:5000/uploads/${product.image}` : null,
            category: product.category, 
            brand: product.brand,       
            price: product.price,
            availability: product.available ? 'InStock' : 'OutOfStock',
            quantity: product.quantity,
        }));
      console.log(modifiedProducts);
      // Send the modified response
      res.status(200).json({ modifiedProducts });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  };

// get product count 
exports.productCount = async(req, res) => {
    try {
        // console.log("Fetching product count...");
        const count = await Product.countDocuments();
        // console.log("Product count fetched successfully:", count);
        res.status(200).send({ count: count });
    } catch (error) {
        console.error('Error fetching product count:', error);
        res.status(500).send({ message: 'Error fetching product count', error });
    }
}