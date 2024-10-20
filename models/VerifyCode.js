import {Schema, model} from "mongoose";
import {translit} from "../utils/translit.js";
import mongooseAutoPopulate from "mongoose-autopopulate";

const VerifyCodeSchema = new Schema({
     user: {
        type: Schema.Types.ObjectId, ref: "user", autopopulate: true
    }, status: {
        type: String,
        default: "pending"
    }, code: {
        type: String,
        unique: true
    }
});

VerifyCodeSchema.plugin(mongooseAutoPopulate)

const VerifyCode = model("verify-code", VerifyCodeSchema);

export const VerifyCodeStatuses = {
    PENDING: "pending",
    DONE: "done"
}

export default VerifyCode;