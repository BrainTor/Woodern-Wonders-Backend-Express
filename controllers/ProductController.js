import {Router} from "express";
import Product from "../models/Product.js";
import {jwtAuth} from "../middlewares/auth.js";
import Rate from "../models/Rate.js";
import {body} from "express-validator";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import Fav from "../models/Favs.js";


const productController = new Router();


productController.get("/", async (req, res) => {
    res.json({products: await Product.find()})
})

productController.get("/myFavs", jwtAuth, async (req, res) => {
    const favs = await Fav.find({
        user: req.user._id
    })

    return res.status(200).json({
        favs: favs
    })
})

productController.post("/fav/:id", jwtAuth, async (req, res) => {
    const candidate = await Product.findOne({
        _id: req.params.id
    });
    if (!candidate) return res.status(404).json({
        errors: [{
            msg: "Продукт не найден"
        }]
    });

    const favC = await Fav.findOne({
        user: req.user,
        product: candidate
    })

    if (favC) {
        await Fav.updateOne({
            _id: favC._id
        }, {
            is: !favC.is
        });
        return res.status(200).json({
            is: !favC.is
        });
    }
    else {
        const c = new Fav({
            user: req.user,
            product: candidate,
            is: true
        });
        await c.save();
        return res.status(200).json({
            is: c.is
        });
    }
});

productController.get("/:id", async (req, res) => {
    const candidate = await Product.findById(req.params.id);
    if (!candidate) return res.status(404).json({
        errors: [{
            msg: "Продукт не найден"
        }]
    });

    return res.json({
        product: {
            ...candidate._doc, rates: await candidate.getAllRates()
        }
    })
})

productController.post("/:id/rate", jwtAuth, body("stars").isInt({
    min: 1, max: 5
}), body("text").isString().isLength({min: 1, max: 1024}), validatorMiddleware, async (req, res) => {
    const candidate = await Product.findOne({
        _id: req.params.id
    });
    if (!candidate) return res.status(404).json({
        errors: [{
            msg: "Продукт не найден"
        }]
    });

    const rate = new Rate({
        product: candidate, user: req.user, stars: req.data.stars, text: req.data.text
    })

    await rate.save();
    return res.json()
})


export default productController;