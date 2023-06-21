const Product = require('../models/product');
const fs = require('fs');
const multer = require('multer');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ =require('lodash');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  category: Joi.string().required(),
});

exports.createProduct = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload.single('photo')(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, price, quantity,category } = value;
    
    const categoryObj =  new mongoose.Types.ObjectId(category); // Convert category to ObjectId

    const productFields = {
      name,
      description,
      price: parseFloat(price), // Convert price to a number
      quantity: parseInt(quantity),
       category: categoryObj,
    };

    const product = new Product(productFields);

    if (req.file) {
      if (req.file.size > 1 * 1024 * 1024) {
        // 1 MB limit
        return res.status(400).json({
          error: 'Image should be less than 1MB',
        });
      }

      const photoData = fs.readFileSync(req.file.path);
      product.photo.data = photoData;
      product.photo.contentType = req.file.mimetype;
    }
    const savedProduct = await product.save();
    res.json({ product: savedProduct });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(400).json({ error: 'Product could not be saved' });
  }
};

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .exec()
    .then(product => {
      if (!product) {
        return res.status(404).json({
          error: 'Product not found!'
        });
      }
      req.product = product;
      next();
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

exports.showProduct = (req, res) => {
  req.product.photo = undefined;
  res.json({
    product: req.product
  });
};


/// update product

exports.updateProduct = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload.single('photo')(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, price, quantity, category } = value;

    const updatedFields = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
    };

    const product = req.product;
    _.assign(product, updatedFields); // Update the product fields with the new values

    if (req.file) {
      if (req.file.size > 1 * 1024 * 1024) {
        return res.status(400).json({
          error: 'Image should be less than 1MB',
        });
      }

      const photoData = fs.readFileSync(req.file.path);
      product.photo.data = photoData;
      product.photo.contentType = req.file.mimetype;
    }

    const savedProduct = await product.save();
    res.json({ product: savedProduct });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(400).json({ error: 'Product could not be updated' });
  }
};


exports.removeProduct = (req, res) => {
  const product = req.product;

  product
    .deleteOne()
    .then(() => {
      res.status(204).json({
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: 'An error occurred while deleting the product',
      });
    });
};



exports.allProducts = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let order = req.query.order ? req.query.order : 'asc';
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .then((products) => {
      res.json({ products });
    })
    .catch((err) => {
      return res.status(404).json({
        error: 'Product not found',
      });
    });
};

exports.relatedProduct=(req,res)=>{

  let limit = req.query.limit ? parseInt(req.query.limit) : 6;


  Product.find({category:req.product.category,_id:{$ne:req.product._id}})
         .limit(limit)
         .select('-photo')
         .populate('category','_id name')
         .then((products) => {
          res.json({ products });
        })
        .catch((err) => {
          return res.status(404).json({
            error: 'Product not found',
          });
        });
}


exports.searchProduct=(req,res)=>{
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let order = req.query.order ? req.query.order : 'asc';
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for(let key in req.body.filters){
    if(req.body.filters[key].length > 0){
      if (key === "price"){
      //gte greater than price [0,10]
      //Lte less than 

      findArgs[key]={
        $gte:req.body.filters[key][0],
        $lte:req.body.filters[key][1]
      };

    }else{
      findArgs[key]=req.body.filters[key];
    }
  }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .skip(skip)
    .then((products) => {
      res.json({ products });
    })
    .catch((err) => {
      return res.status(404).json({
        error: 'Product not found',
      });
    });
}

exports.photoProduct=(req,res)=>{

  const{data,contentType}=req.product.photo;

  if (data){

    res.set('Content-Type',contentType)

    return res.send(data)
  }

}