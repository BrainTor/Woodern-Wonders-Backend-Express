import {Schema, model} from "mongoose";
import {translit} from "../utils/translit.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const SubCatalogSchema = new Schema(
    {
        urlId: {
          type: String
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        catalog: {
            type: Schema.Types.ObjectId,
            ref: "catalog",
            autopopulate: true,
            required: true
        }
    });


SubCatalogSchema.pre('save', async function (next) {
    const c = this;
    c.urlId = translit(c.name);
    next();
});

SubCatalogSchema.plugin(mongooseAutoPopulate)


const SubCatalog = model("sub-catalog", SubCatalogSchema);

export default SubCatalog;