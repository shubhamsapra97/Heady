const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const {Category} = require('./category');

// For Object ID encryption and decryption.
const Hashids = require("hashids");
const hashids = new Hashids('sdfsd');

// Create Schema
var ProductSchema = new Schema({
    pName: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

ProductSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['encrypthash','pName','price','categories']);
}

// Find product duplicates
ProductSchema.statics.findProductDuplicates = function(data){
    
    var Product = this;
    return new Promise((resolve,reject) => {
       
        Category.findOne({
            cName: data.category.parent,
            level: data.category.level
        }).then((resp) => {

            let productIds = resp.products;
            
            Product.find({
                '_id': {
                    $in: productIds
                }
            }).then((resp1) => {
                
                let pNames = resp1.filter((pname) => {
                    return pname.pName == data.pName;
                });
                
                if (pNames && pNames.length > 0) {
                    resolve(pNames);
                }
                resolve(false);
            })

        }).catch((err) => {
            console.log(err);
        });
        
    });
    
}

//Creating Mongoose Model
var Product = mongoose.model('Product', ProductSchema);

//Exporting Users 
module.exports = {
    Product
};