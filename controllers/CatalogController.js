import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import {Router} from "express";
import Catalog from "../models/Catalog.js";
import Product from "../models/Product.js";
import SubCatalog from "../models/SubCatalog.js";


const catalogController = new Router();

catalogController.get("/", async (req, res) => {
    res.json({
        catalogs: await Catalog.find()
    })
})

catalogController.get("/:id", async (req, res) => {
    const candidate = await Catalog.findOne({
        urlId: req.params.id
    });
    if (!candidate) return res.status(404).json({
        errors: [
            {
                msg: "Каталог не найден"
            }
        ]
    });

    const subs = await SubCatalog.find({
        catalog: candidate
    })
    return res.json({
        subcatalogs: subs
    }) 
})

catalogController.get("/sub/:id", async (req, res) => {
    let {offset, limit} = req.query;
    if (!offset) offset = 0;
    if (!limit) limit = 50;
    console.log(req.params)

    const candidate = await SubCatalog.findOne({
        urlId: req.params.id 
    });
    if (!candidate) return res.status(404).json({
        errors: [
            {
                msg: "Каталог не найден"
            }
        ]
    });

    const products = await (Product.find({
        subcatalog: candidate
    }).skip(offset).limit(limit))

    return res.json({
        count: await Product.find().count(),
        products
    })
})




export default catalogController;