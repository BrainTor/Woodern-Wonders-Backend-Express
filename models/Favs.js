import  {Schema, model} from "mongoose";
import {translit} from "../utils/translit.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const FavSchema = new Schema(
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
        is: {
            type: Boolean,
            default: true
        }
    });

FavSchema.plugin(mongooseAutoPopulate)

const Fav = model("fav", FavSchema);

export default Fav;