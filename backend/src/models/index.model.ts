import User from "./users/user.model.js"
import UserSession from "./users/userSession.model.js"
import UserAddress from "./users/userAddress.model.js"
import UserWishList from "./users/userWishList.model.js"
import UserCart from "./users/userCart.model.js"

import Brand from "./product/brand.model.js"
import Category from "./product/category.model.js"
import Color from "./product/color.model.js"
import CountryOfOrigin from "./product/countryOfOrigin.model.js"
import Dimension from "./product/dimension.model.js"
import Fabric from "./product/fabric.model.js"
import Length from "./product/length.model.js"
import Occasion from "./product/occasion.model.js"
import Pattern from "./product/pattern.model.js"
import Product from "./product/product.model.js"
import ProductType from "./product/productType.model.js"
import ShippingCharge from "./product/shippingCharge.model.js"
import Size from "./product/size.model.js"
import SubCategory from "./product/subcategory.model.js"
import Weight from "./product/weight.model.js"
import Catalog from "./product/catalog.model.js"

/*Depreciated Models*/
// import Volume from "./product/volume.model.js"

const models = {
    //Users
    User,
    UserSession,
    UserAddress,
    UserWishList,
    UserCart,

    //Product
    Product,
    Brand,
    Category,
    SubCategory,
    Color,
    Size,
    Pattern,
    Occasion,
    Fabric,
    ProductType,
    ShippingCharge,
    Weight,
    Dimension,
    Length,
    CountryOfOrigin,
    Catalog

    /*Depreciated Models*/
    // Volume,
};

Object.values(models).forEach((model: any) => {
    if (model.associate) {
        model.associate(models);
    }
});

export default models;