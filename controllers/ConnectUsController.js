import {Router} from "express";
import ConnectUs from "../models/ConnectUs.js";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import {body} from "express-validator";
import {botMiddleware} from "../bot.js";
import User from "../models/User.js";
import geoip from "geoip-lite";

const connectUsController = Router();
connectUsController.use(botMiddleware)

connectUsController.post("/",
    body("name").isString(),
    body("phoneEmail").isString(),
    validatorMiddleware,
    async (req, res) => {
    const {name, phoneEmail} = req.data;
    const u = new ConnectUs({
        name,
        phoneEmail
    });

    await u.save();
    console.log(`new message from ${name} and ${phoneEmail}`);
    const userAgent = req.get('user-agent');
    const jwt = req.body.jwtToken;
    let userData = `Нет входа.`;
    if (jwt) {
        const user = await User.findByJwt(jwt)
        userData = user.login || user.email || user.phoneNumber || user._id;
    }
    let message = `Новое обращение\n`;
    message += `Пользователь: ${userData}\n`;
    message += `Имя: ${name}\n`;
    message += `Номер телефона/Email: ${phoneEmail}\n`;
    message += `IP Адрес: ${req.clientIp}\n`;
    const geo = geoip.lookup(req.clientIp);
    if (geo)
        message += `Геолокация: ${geo.country}, ${geo.city}\n`;
    else
        message += `Геолокация: Неизвестна\n`
    message += `User Agent: ${userAgent}\n`;

    req.bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, message);
    res.status(200).json({status: true, message: u});
})

export default connectUsController;