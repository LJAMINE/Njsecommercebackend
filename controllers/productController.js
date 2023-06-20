const Product = require('../models/product');
const fs = require('fs');
const multer = require('multer');
const Joi = require('joi');
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

    const productFields = {
      name,
      description,
      price: parseFloat(price), // Convert price to a number
      quantity: parseInt(quantity),
       category,
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






// const Product = require('../models/product');
// const fs =require('fs');

// const formidable=require('formidable');

// exports.craeteProduct=(req,res)=>{
//   let form =new formidable.IncomingForm();

//   form.keepExtentions=true;

//   form.parse(req,(err,fields,files)=>{

//     if(err){
//       return res.status(400).json({
//         error:'image not upload '
//       })
//     }

//     let product=new Product(fields);

//     if(fields.photo){

//       product.photo.data = fs.readFileSync(files.photo.path)
//       product.photo.contentType = files.photo.type
      
//     }

//     photo.save((err,product)=>{
//       if (err){
//         return res.status(400).json({
//           error:'product not persist  '
//         })
//       }
//       res.json({
//         product
//       }) 
      
//     })
   

//   })
// }



// working just the problem in photo 

// const Product = require('../models/product');
// const fs = require('fs').promises;

// exports.createProduct = async (req, res) => {
//   try {
//     const formidable = await import('formidable');
//     const form = new formidable.IncomingForm();
//     form.keepExtensions = true;

//     const { fields, files } = await new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve({ fields, files });
//       });
//     });

//     const productFields = {
//       name: fields.name[0],
//       description: fields.description[0],
//       price: parseFloat(fields.price[0]),
//       quantity: parseInt(fields.quantity[0]),
//     };

//     const product = new Product(productFields);

//     if (fields.photo) {
//       const photoData = await fs.readFile(files.photo.path);
//       product.photo.data = photoData;
//       product.photo.contentType = files.photo.type;
//     }

//     const savedProduct = await product.save();
//     res.json({ product: savedProduct });
//   } catch (error) {
//     console.error('Error occurred:', error);
//     res.status(400).json({ error: 'Product could not be saved' });
//   }
// };



