const {database} = require('../DAL/loadDatabase');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Products = require('./mongooseModels/products');

exports.list = async (filter, currentPage) => {
    const currPage = currentPage || 1;
    const res = await Products.paginate(filter, {page: currPage, limit: 2});

    if(res.hasNextPage){
        const secondPaging = parseInt(res.nextPage) + 1;
        if(secondPaging <= res.totalPages){
            res.secondNextPage = secondPaging;
        }
    }

    if(res.hasPrevPage){
        const secondPaging = parseInt(res.prevPage) - 1;
        if(secondPaging >= 1){
            res.secondPrevPage = secondPaging;
        }
    }
    return res;
}

exports.getProduct = async (id) => {
    return Products.findOne({'_id': ObjectId(id)});
}

exports.getProductByType = async (type) =>{
    return Products.find({'type': type});
}

exports.getProductByTypeAndNumber = async (type, number) =>{
    //const collection = database().collection('Products');
    return Products.find({'type': type}).limit(number);
}

exports.Search = async (text) => {
    return Products.find(
        { 'name': { "$regex": text, "$options": "i" } }
    );
}
