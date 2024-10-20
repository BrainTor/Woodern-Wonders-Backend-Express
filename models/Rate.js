import  {Schema, model} from "mongoose";
import {translit} from "../utils/translit.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const RateSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "product",
            autopopulate: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            autopopulate: true
        },
        stars: {
            type: Number
        },
        text: {
            type: String
        }
    });

RateSchema.plugin(mongooseAutoPopulate)

const Rate = model("rate", RateSchema);

export default Rate;