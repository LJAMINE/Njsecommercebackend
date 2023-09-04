const express=require ('express');

const{userById}=require('../middlewares/user');

const router= express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  

const upload = multer({ storage : storage });


const {
    allCategories,
    createCategory,
    categoryId,
    showCategory,
    updateCategory,
    deleteCategory
}=require('../controllers/categoryController');

const{requireSignIn,isAuth,isAdmin }=require('../middlewares/auth');

router.get('/',allCategories);

router.get('/:categoryId',showCategory);

router.post('/create/:userId',[requireSignIn,isAuth,isAdmin],upload.single("photo"),createCategory);

router.put('/:categoryId/:userId',[requireSignIn,isAuth,isAdmin],updateCategory);

router.delete('/:categoryId/:userId',[requireSignIn,isAuth,isAdmin],deleteCategory);


router.param('userId',userById);

router.param('categoryId',categoryId);


module.exports=router;