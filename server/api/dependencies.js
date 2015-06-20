'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var productsSchema = new mongoose.Schema({id:Number, name:String, description:String});

var products = mongoose.model('products', productsSchema);

module.exports = {products: products};
