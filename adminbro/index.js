import AdminJS from "admin-bro";
// autopopulate support in my fork/submodule
// https://github.com/SoftwareBrothers/adminjs-mongoose/pull/43
import * as AdminBroMongoose from "../../admin-bro-mongoose/lib/index.js";
import AdminBroExpress from "admin-bro-expressjs";
import User from "../models/User.js"
import Catalog from "../models/Catalog.js";
import Product from "../models/Product.js";
import Rate from "../models/Rate.js";
import SubCatalog from "../models/SubCatalog.js";
import ConnectUs from "../models/ConnectUs.js";
AdminJS.registerAdapter(AdminBroMongoose)



const adminBro = new AdminJS({
    databases: [],
    rootPath: '/admin',
    resources: [User, Catalog, Product, Rate, SubCatalog, ConnectUs],
    branding: {
        logo: false,
        companyName: "Wooden Wonders",
        softwareBrothers: false
    }
})


const router = AdminBroExpress.buildRouter(adminBro)

export default [adminBro.options.rootPath, router]