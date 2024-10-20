import {model, Schema} from "mongoose";
import secret from "../utils/secret.js";
import bcryptjs from "bcryptjs";
import {v4} from "uuid";
import pkg from 'jsonwebtoken';
import {sendMail} from "../utils/mail.js";
import VerifyCode, {VerifyCodeStatuses} from "./VerifyCode.js";

const {verify, sign} = pkg;


const UserSchema = new Schema({
    login: {
        type: String, required: true, unique: true,
    }, email: {
        type: String, required: false
    }, phoneNumber: {
        type: Number, required: false
    }, password: {
        type: String, required: false
    }, googleId: {
        type: String, default: "not-connected"
    }, vkId: {
        type: String, default: "not-connected"
    }, yaId: {
        type: String, default: "not-connected"
    }, role: {
        type: String, default: "user"
    }, isVerifiedEmail: {
        type: Boolean, default: false
    }
});

UserSchema.statics.findByJwt = async function (jwt) {
    try {
        const payload = verify(jwt, secret);

        return await this.model('user').findOne({_id: payload.id});
    } catch (e) {
        return null;
    }
}

UserSchema.methods.createJwt = function () {
    const payload = {
        id: this._id
    };

    return sign(payload, secret);
}

UserSchema.methods.serialize = function () {
    const {password, __v, ...data} = this._doc;
    return data;
}

UserSchema.methods.comparePassword = function (s) {
    return bcryptjs.compareSync(s, this._doc.password)
}

UserSchema.methods.sendVerifyEmailCode = async function () {
    if (this.isVerifiedEmail) return true;
    if (!this.email) return false;
    const code = `ww-${v4()}`;
    const verif = new VerifyCode({
        code, user: this
    })
    await verif.save()
    // TODO: Change to HTML Template
    await sendMail(this.email, "Wooden Wonders Верификация", `Ваш код верификации: ${code}, Ссылка для быстрой верификации https://woodenwonders.ru/profile/verifyEmail?code=${code}`)
}

UserSchema.methods.verifyEmail = async function (code) {
    if (this.isVerifiedEmail) return true;
    if (!this.email) return false;
    if (!code.startsWith("ww-")) return false;
    const cs = await VerifyCode.find({code, status: VerifyCodeStatuses.PENDING, user: this});
    if (cs.length > 0) {
        this.isVerifiedEmail = true;
        await VerifyCode.updateOne({
            code
        }, {
            status: VerifyCodeStatuses.DONE
        })
        await this.save();
        return true;
    }
    return false;
}

UserSchema.pre('save', async function (next) {
    const user = this;
    if (this.password) user.password = await bcryptjs.hash(user.password, 10);
    next();
});


const User = model("user", UserSchema);
const UserRoles = {
    USER: "user", ADMIN: "admin"
}
export default User;
export {UserRoles};