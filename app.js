import express from "express";
import cors from "cors";
import userRouter from "./controllers/UserController.js";
import productRouter from "./controllers/ProductController.js";
import catalogRouter from "./controllers/CatalogController.js";
import connectUsController from "./controllers/ConnectUsController.js";
import session from "express-session";
import passport from "passport";
import adminBro from "./adminbro/index.js"
import "./rpassport/index.js";
import * as url from 'url'
import * as path from "path";
import telegraf from "telegraf";
import requestIp from "request-ip";

const app = express();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // TODO: change to HTTPS
    cookie: { secure: false }
}))

app.use(express.static(path.join(__dirname, '../static')));
app.use(passport.initialize());
app.use(passport.session());
app.use(requestIp.mw())


app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/catalog", catalogRouter);
app.use("/connectus", connectUsController);


app.use(adminBro[0], adminBro[1])

export {
    app
};