const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    console.log(req.body);
    try {
        const { name } = req.body;

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

       
        const category = new Category({
            name,
            createdBy: req.user.id 
        });

        const savedCategory = await category.save();
        res.status(201).send(savedCategory);
    } catch (error) {
        res.status(500).send({ message: 'Error creating category', error });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({},{name:1});
        res.status(200).send({categories:categories});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        console.log(req.params, req.body);
        let category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        category.name = categoryName;
        category = await category.save();
        res.status(202).send(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).send({ msg: 'Category not found' });
        }
        
        await Category.deleteOne({ _id: id });
        res.status(200).send({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


