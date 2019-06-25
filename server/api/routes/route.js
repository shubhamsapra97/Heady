const router = require('express').Router();
const _ = require('lodash');

const Hashids = require("hashids");
const hashids = new Hashids('sdfsd');

const {Category} = require('../../models/category');
const {Product} = require('../../models/product');

//@route GET api/auth/getCategory
//@description get  Category
router.get('/getCategory' , (req,res) => {
    
    let body = req.query;
    let result = {};
    Category.find({
        level: body.level,
        parent: body.parent
    }).then((resp) => {
        if (resp && resp.length > 0) {
            result['data'] = resp;
            result['status'] = '200';
            result['message'] = 'Categories retrieved successfully';
        } else if (resp && resp.length == 0){
            result = {
                'status': '204',
                'message': 'No Categories' 
            }
        } else {
            result = {
                'status': '400',
                'message': 'Bad Request' 
            }
        }
        res.json([result]);
    });
    
});

//@route GET api/auth/getCategoryChild
//@description get Children Categories
router.get('/getCategoryChild' , (req,res) => {
    let body = req.query;
    let result = {};
    
    Category.find({
        level: body.level,
        cName: body.parent
    }).then((resp) => {
        if (resp && resp.length > 0) {
            let childCategoriesId = resp[0].childCategories;
            
            Category.find({
                '_id': {
                    $in: childCategoriesId
                }
            }).then((resp) => {
                
                if (resp) {
                    result['data'] = resp;
                    result['status'] = '200';
                    result['message'] = 'Child Categories retrieved successfully';
                } else {
                    result = {
                        'status': '400',
                        'message': 'Bad Request' 
                    }
                }
                
                res.json([result]);
                
            });
            
        } else {
            result = {
                'status': '400',
                'message': 'Bad Request' 
            }
        }
        
    });
    
});

//@route POST api/auth/addCategory
//@description add Category
router.post('/addCategory',(req,res) => {
    
    let body = _.pick(req.body,['cName','level','childCategories','mainParent',"parent"]);
    let result = "";
    
    if (body && Object.keys(body).length > 0 && body.cName && body.level) {
        
        Category.findCategoryDuplicates(body).then((response) => {
           if (response) {
                
                result = {
                    "status": '409',
                    "message": "Category already present"
                };
                res.json([result]);
               
           } else {
               
                let saveCategory = new Category(body);
               
                saveCategory.save().then((category) => {
                    if (res) {
                        result = {
                            "status": '200',
                            "message": "Category saved successfully"
                        };
                        
                        if (body.parent && body.parent.length > 0) {
                            Category.findOneAndUpdate({
                                cName: body.parent,
                                level: body.level - 1
                            },{
                                 $push: {
                                     childCategories: category._id
                                 } 
                            }).then((resp) => {
                                console.log("child record added for parent ",body.parent);
                            });  
                        }
                        
                        res.json([result]);   
                    }
                });
               
           }
            
        }).catch((err) => {
            console.log("err ",err);
        });
        
    }
    
    
});

//@route POST api/auth/addCategory
//@description add Category
router.post('/addProduct',(req,res) => {
    
    let body = _.pick(req.body,['category','pName','price']);
    
    let result = {};
    
    if (body && Object.keys(body).length > 0) {
        if (!body.category || !body.category.parent) {
            result = {
                'status': '412',
                'message': 'Product Category Missing'
            }
        } else {
            
            Product.findProductDuplicates(body).then((duplicatePro) => {
               
                if (duplicatePro) {
                
                    result = {
                        "status": '409',
                        "message": "Product already present in this Category"
                    };
                    res.json([result]);

               } else {
                   
                    let data = {
                        price: body.price,
                        pName: body.pName
                    }

                    let product  = new Product(data);
                    product.save().then((pro) => {

                        Category.findOneAndUpdate({
                            cName: body.category.parent,
                            level: body.category.level
                        },{
                            $push: {
                                products: pro._id
                            }
                        }).then((resp) => {

                            if (resp) {
                                result['status'] = '200';
                                result['message'] = 'Product saved successfully';
                            }

                            res.json([result]);

                        }).catch((err) => {
                            console.log(err);
                        });

                    }).catch((err) => {
                        console.log(err);
                    }) ;
               }

            });   
        
        }
    }
    
});

//@route GET api/auth/getProducts
//@description get Products
router.get('/getProducts',(req,res) => {
    
    console.log("here");
    
    let body = req.query;
    let result = {};
    
    Category.find({
        level: body.level,
        cName: body.parent
    }).then((resp) => {
        
        if (resp && resp.length > 0) {
            
            let productId = resp[0].products;
            Product.find({
                '_id': {
                    $in: productId
                }
            }).then((resp) => {
                
                if (resp && resp.length > 0) {                   
                    for (let i in resp) {
                        let a = hashids.encodeHex(resp[i]['_doc']['_id']);
                        resp[i]['_doc']['encrypthash'] = a;
                    }
                    result['data'] = resp;
                    result['status'] = '200';
                    result['message'] = 'Products retrieved successfully';
                } else if (resp && resp.length == 0){
                    result['data'] = [];
                    result['status'] = '200';
                    result['message'] = 'Products retrieved successfully';
                } else {
                    result = {
                        'status': '400',
                        'message': 'Bad Request' 
                    }
                }
                console.log(result);
                res.json([result]);
                
            });
            
        } else {
            result = {
                'status': '400',
                'message': 'Bad Request' 
            }
        }
        
    });
    
});

//@route GET api/auth/getEditProductDetails
//@description get edit Category Details
router.get('/getEditProductDetails',(req,res) => {
    
    let body = req.query;
    
    if (body && body._id) {
        
        let decryptHash = hashids.decodeHex(body._id);
        console.log(decryptHash);
        
        Product.findOne({
            _id: decryptHash
        }).then((resp)=>{

            let result = {};

            if (resp && Object.keys(resp).length > 0) {

                result = {
                    'data': resp,
                    'status': '200',
                    'message': 'Edit Product details retrieved Successfully'
                }

            } else if(resp && Object.keys(resp).length == 0){

                result = {
                    'status': '404',
                    'message': 'No Product Found'
                }

            } else {

                result = {
                    'status': '400',
                    'message': 'Bad Request' 
                }

            }
            
            res.json([result]);

        });
        
    }
    
});

//@route PUT api/auth/editProducts
//@description edit Product
router.put('/editProducts' , (req,res) => {
    
    
    let body = _.pick(req.body,['_id','pName','price']);
    
    if (body && Object.keys(body).length && body._id && body.price && body.pName) {
        
        let decryptHash = hashids.decodeHex(body._id);
        console.log(decryptHash);
        
        Product.findOneAndUpdate({
            _id: decryptHash
        },{
            pName: body.pName,
            price: body.price
        }).then((resp) =>{
            
            let result = {};
            if (resp) {
                result = {
                    'status': '201',
                    'message': 'Product has been updated successfully'
                }
            } else {
                result = {
                    'status': '304',
                    'message': 'Not Modified' 
                }
            }
            
            res.json([result]);
            
        });
        
    }
});

module.exports = router;
