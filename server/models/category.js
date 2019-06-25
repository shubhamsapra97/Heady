const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

// Create Schema
var CategorySchema = new Schema({
    cName: {
        type: String,
        trim: true,
        required: true
    },
    level: {
        type: Number
    },
    childCategories: {
        type: Array
    },
    products: {
        type: Array
    },
    mainParent: {
        type: String,
        default: null
    },
    parent: {
        type: String,
        default: null
    }
});

CategorySchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['category_id','cName','level','childCategories','mainParent','parent','products']);
}

// find Duplicate Categories
CategorySchema.statics.findCategoryDuplicates = function(data){
    
    var Category = this;
    return new Promise((resolve,reject) => {
        Category.findOne({
            cName: data.cName,
            level: data.level
        }).then((category) => {
            if (category) {
                resolve(category);
            }
            resolve(false);
        });
        
    });
    
}

//Creating Mongoose Model
var Category = mongoose.model('Category', CategorySchema);

//Exporting Users 
module.exports = {
    Category
};