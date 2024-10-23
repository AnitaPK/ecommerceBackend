const Cart = require('../models/cart'); 
const Product = require('../models/product');


exports.addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body; 
    const userId = req.user.id; 
    console.log("req.body", req.body, "and userID", userId);

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            // Create a new cart if one does not exist
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            // Check if the item already exists in the cart
            const existingItem = cart.items.find(item => {
                return item.product && item.product._id.toString() === productId;
            });

            if (existingItem) {
                // Update the quantity of the existing item
                existingItem.quantity += quantity;
            } else {
                // Add the new item to the cart
                cart.items.push({ product: productId, quantity });
            }
        }

        // Calculate total price
        let totalPrice = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.product); 
            if (product) {
                totalPrice += product.price * item.quantity; 
            }
        }
        
        cart.totalPrice = totalPrice; // Update total price in cart
        await cart.save(); // Save the cart with updated total price
        return res.status(200).send(cart);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get all cart items
exports.getAllCartItems = async (req, res) => { 
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        return res.status(200).json(cart); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteItemFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params; 

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        // Filter out the item to be deleted
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Calculate total price after item removal
        let totalPrice = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        }

        cart.totalPrice = totalPrice; 
        await cart.save(); 

        return res.status(200).json(cart); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


//Empty Cart

exports.emptyCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { items: [], totalPrice: 0 }, 
            { new: true } 
        );

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        return res.status(200).json(cart); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


//Update Quantity
exports.updateQuantity = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    console.log(userId, productId, quantity);

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.product'); // Populate product details
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        // Find the item in the cart
        const existingItem = cart.items.find(item => item.product.equals(productId)); // Corrected comparison
        console.log(existingItem, "existingItem");
        if (!existingItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Update the quantity
        existingItem.quantity = quantity;

        // Calculate total price
        let totalPrice = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        }

        cart.totalPrice = totalPrice; 
        await cart.save(); 

        // Return updated cart including populated product details
        return res.status(200).json({ items: cart.items, totalPrice: cart.totalPrice }); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

