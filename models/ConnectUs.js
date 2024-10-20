import {Schema, model} from "mongoose";
import {translit} from "../utils/translit.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const ConnectUsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneEmail: {
        type: String,
        required: true
    }
});

ConnectUsSchema.plugin(mongooseAutoPopulate)

const ConnectUs = model("connect-us", ConnectUsSchema);

export default ConnectUs;