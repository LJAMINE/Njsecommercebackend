const Category = require('../models/category');
const fs = require('fs');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');


const schema = Joi.object({
  name: Joi.string().required()
  
});

exports.createCategory = async (req,res) => {
  try {
  
    const file =req.file;
      console.log(file);

     const categoryImage=`uploads/${file.filename}`;

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { name} = value;

    var data = {
      "name":name,
      "photo": categoryImage
    }

    
    const savedCategory = await Category(data).save();
    res.json({ category: savedCategory });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(400).json({ error: 'Category could not be created' });
  }
};



exports.categoryId = (req, res, next, id) => {
  Category.findById(id)
    .exec()
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          error: 'Category not found',
        });
      }

      req.category = category;
      next();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });
};



exports.showCategory=(req,res)=>{
  let category=req.category;
  res.json({
    category
  })
}


exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name; // Update the name with the new value

  category
    .save()
    .then(updatedCategory => {
      res.json({
        category: updatedCategory
      });
    })
    .catch(err => {
      res.status(400).json({
        error: 'Bad request!!!'
      });
    });
};



exports.deleteCategory = (req, res) => {
  const categoryId = req.params.categoryId;

  Category.findByIdAndRemove(categoryId)
    .exec()
    .then(deletedCategory => {
      if (!deletedCategory) {
        return res.status(404).json({
          error: 'Category not found',
        });
      }

      res.status(204).json({
        message: 'Category deleted',
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Internal server error',
      });
    });
};


exports.allCategories = (req, res) => {
  Category.find()
    .exec()
    .then(category => {
      res.json({ category });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};











