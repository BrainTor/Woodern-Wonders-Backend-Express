import telegraf from "telegraf";

const bot = new telegraf.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const botMiddleware = (req, res, next) => {
    req.bot = bot;
    next();
}
export {bot, botMiddleware}