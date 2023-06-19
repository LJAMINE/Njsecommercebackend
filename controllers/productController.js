// const Product = require('../models/product');
// const fs = require('fs');

// exports.createProduct = (req, res) => {
//   import('formidable').then((formidable) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;

//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         return res.status(400).json({
//           error: 'Image could not be uploaded',
//         });
//       }

//       let product = new Product(fields);

//       if (fields.photo) {
//         product.photo.data = fs.readFileSync(files.photo.path);
//         product.photo.contentType = files.photo.type;
//       }

//       product.save((err, savedProduct) => {
//         if (err) {
//           return res.status(400).json({
//             error: 'Product could not be saved',
//           });
//         }

//         res.json({
//           product: savedProduct,
//         });
//       });
//     });
//   }).catch((err) => {
//     console.error('Error occurred:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   });
// };




const Product = require('../models/product');
const fs = require('fs').promises;

exports.createProduct = async (req, res) => {
  try {
    const formidable = await import('formidable');
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const productFields = {
      name: fields.name[0],
      description: fields.description[0],
      price: parseFloat(fields.price[0]),
      quantity: parseInt(fields.quantity[0]),
    };

    const product = new Product(productFields);

    if (fields.photo) {
      const photoData = await fs.readFile(files.photo.path);
      product.photo.data = photoData;
      product.photo.contentType = files.photo.type;
    }

    const savedProduct = await product.save();
    res.json({ product: savedProduct });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(400).json({ error: 'Product could not be saved' });
  }
};



// const Product = require('../models/product');
// const fs = require('fs');

// exports.createProduct = async (req, res) => {
//   try {
//     const { IncomingForm } = await import('formidable');
//     let form = new IncomingForm();
//     form.keepExtensions = true;

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return res.status(400).json({
//           error: 'Image could not be uploaded',
//         });
//       }

//       let product = new Product(fields);

//       if (files.photo && files.photo.path) {
//         try {
//           product.photo.data = fs.readFileSync(files.photo.path);
//           product.photo.contentType = files.photo.type;
//         } catch (error) {
//           return res.status(500).json({
//             error: 'Failed to read the photo file',
//           });
//         }
//       }

//       try {
//         const savedProduct = await product.save();
//         res.json({
//           product: savedProduct,
//         });
//       } catch (error) {
//         return res.status(400).json({
//           error: 'Failed to save the product',
//         });
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: 'Internal server error',
//     });
//   }
// };



