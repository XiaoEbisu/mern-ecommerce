const Category = require('../models/category');
const slugify = require('slugify');


//List categories (and theirs children categories)
function createCategories(categories, parentId = null) {
    
    const categoryList = [];
    let listCategories;

    if (parentId == null) {
        listCategories = categories.filter( category => category.parentId == undefined );
    } else {
        listCategories = categories.filter( category => category.parentId == parentId );
    }

    for (let cat of listCategories) {
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            children: createCategories(categories, cat._id)
        });
    }

    return categoryList;

};

exports.addCategory = (req, res) =>{

    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name)
    }

    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);
    
    cat.save((error, category) => {
        if (error) return res.status(400).json({ error });
        if (category) {
            return res.status(201).json({ category });
        }
    });

};

exports.getCategory = (req, res) => {

    Category.find({})
    .exec((error, categories) => {
        if (error) return res.status(400).json({ error });
        if (categories) {

            const categoryList = createCategories(categories);

            return res.status(200).json({ categoryList });
        }
    });

};