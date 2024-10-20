import {Schema, model} from "mongoose";
import {translit} from "../utils/translit.js";

const CatalogSchema = new Schema(
    {
        urlId: {
          type: String
        },
        name: {
            type: String,
            required: true,
            unique: true
        }
    });


CatalogSchema.pre('save', async function (next) {
    const c = this;
    c.urlId = translit(c.name);
    next();
});

const Catalog = model("catalog", CatalogSchema);

export default Catalog;