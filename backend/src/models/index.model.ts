import User from "./users/user.model.js"
import UserAddress from "./users/userAddress.model.js"
import UserWishList from "./users/userWishList.model.js"
import UserCart from "./users/usercart.model.js"

import Category from "./product/category.model.js"
import SubCategory from "./product/subcategory.model.js"
import Brand from "./product/brand.model.js"
import Product from "./product/product.model.js"

const models = {
    User,
    UserAddress,
    UserWishList,
    UserCart,
    Product,
    Brand,
    Category,
    SubCategory
};

Object.values(models).forEach((model: any) => {
    if (model.associate) {
        model.associate(models);
    }
});

export default models;