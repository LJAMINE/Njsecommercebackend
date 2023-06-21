const category = require('../models/category');
const Category = require('../models/category');

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category
    .save()
    .then(savedCategory => {
      res.json({
        category: savedCategory
      });
    })
    .catch(err => {
      res.status(400).json({
        error: 'Bad request!!!'
      });
    });
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











