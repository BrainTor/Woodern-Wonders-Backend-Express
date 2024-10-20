import {model, Schema} from "mongoose";
import {translit} from "../utils/translit.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const ProductSchema = new Schema(
    {
        urlId: {
          type: String
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        desc: {
            type: String,
            required: true
        },
        photos: {
            type: [{
                type: String
            }],
            default: []
        },
        price: {
            type: Number,
            default: 0
        },
        subcatalog: {
            type: Schema.Types.ObjectId,
            ref: "sub-catalog",
            autopopulate: true,
            required: true
        }
    });

ProductSchema.plugin(mongooseAutoPopulate)
ProductSchema.pre('save', async function (next) {
    const c = this;
    c.urlId = translit(c.name);
    next();
});

ProductSchema.methods.getAllRates = async function () {
    const Rate = this.model("rate");
    return await Rate.find({
        product: this
    });
}

const Product = model("product", ProductSchema);

export default Product;