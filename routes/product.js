const express=require ('express');

const{userById}=require('../middlewares/user');

const router= express.Router();

const {createProduct
    ,showProduct
    ,productById
    ,removeProduct
    ,updateProduct
}=require('../controllers/productController');

const{requireSignIn,isAuth,isAdmin }=require('../middlewares/auth');

router.get('/:productId',showProduct);

router.post('/create/:userId',[requireSignIn,isAuth,isAdmin],createProduct);

router.put('/:productId/:userId',[requireSignIn,isAuth,isAdmin],updateProduct)


router.delete('/:productId/:userId',[requireSignIn,isAuth,isAdmin],removeProduct)

router.param('userId',userById)
router.param('productId',productById)


module.exports=router;