const Brand = require('../models/brand');

exports.createBrand = async (req, res) => {
    console.log(req.body);
    try {
        const { name } = req.body;
        const image = req.file ? req.file.filename : null;

        // Check if the category already exists
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).json({ message: 'Brand name already exists' });
        }

       
        const brand = new Brand({
            name,
            image,
            createdBy: req.user.id 
        });

        const savedBrand = await brand.save();
        res.status(201).send(savedBrand);
    } catch (error) {
        res.status(500).send({ message: 'Error creating Brand', error });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({},{name:1,image:1});
        const modifiedBrands = brands.map(brand => ({
            _id : brand._id,
            name:brand.name,
            image:brand.image ? `http://localhost:5000/uploads/${brand.image}` :null,
        }))
        res.status(200).send({brands:modifiedBrands});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { brandName } = req.body;
        console.log(req.params, req.body);
        let brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ msg: 'Brand not found' });
        }
        brand.name = brandName;
        brand = await brand.save();
        res.status(202).send(brand);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findById(id);
        
        if (!brand) {
            return res.status(404).send({ msg: 'Brand not found' });
        }
        
        await Brand.deleteOne({ _id: id });
        res.status(200).send({ msg: 'Brand removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


