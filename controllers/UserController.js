import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import {body} from "express-validator";
import {Router} from "express";
import User from "../models/User.js";
import passport from "passport";
import {jwtAuth, localAuth, googleAuth, yaAuth, vkAuth} from "../middlewares/auth.js"

const userRouter = new Router();
import {isPhoneValid, isEmailValid, formatPhoneNumber} from "../utils/regex-shit.js"

userRouter.post("/register", body("login")
    .isLength({
        min: 3, max: 32
    }), body("password")
    .isLength({
        min: 8, max: 128
    }), validatorMiddleware, async (req, res) => {
    const {login, password} = req.data;
    const {email, phoneNumber} = req.body;
    if (email) {
        if (isEmailValid(email)) {
            if ((await User.findOne({
                email
            }))) {
                return res.status(200).json({
                    errors: [{
                        msg: "Пользователь с таким email уже существует."
                    }]
                })
            }
        } else {
            return res.status(200).json({
                errors: [{
                    msg: "Email не валидный."
                }]
            })
        }
    }
    if ((await User.findOne({
        login
    }))) {
        return res.status(200).json({
            errors: [{
                msg: "Пользователь с таким логином уже существует."
            }]
        })
    }
    if (phoneNumber) {
        console.log(formatPhoneNumber(phoneNumber))
        if (isPhoneValid(formatPhoneNumber(phoneNumber))) {
            if ((await User.findOne({
                phoneNumber: phoneNumber ? formatPhoneNumber(phoneNumber) : undefined
            }))) {
                return res.status(200).json({
                    errors: [{
                        msg: "Пользователь с таким номером телефона уже существует."
                    }]
                })
            }
        } else {
            return res.status(200).json({
                errors: [{
                    msg: "Телефон не валидный."
                }]
            })
        }
    }

    const user = new User({
        login, password, email, phoneNumber: phoneNumber ? formatPhoneNumber(phoneNumber) : undefined
    });
    await user.save();
    return res.status(200).json({
        jwt: await user.createJwt(), user: user._doc
    })
});

userRouter.post("/login", localAuth, async (req, res) => {
    res.status(200).json({
        user: req.user.serialize(), jwt: await req.user.createJwt()
    })
});

userRouter.get("/profile", jwtAuth, async (req, res) => res.json({
    user: req.user.serialize(), jwt: await req.user.createJwt()
}))

userRouter.get("/login/google", (req, res, next) => {
    req.session.oauthRedirect = req.query.redirect
    googleAuth(req, res, next);
})
userRouter.get("/login/google/redirect", googleAuth, async (req, res) => {
    if (!req.session.oauthRedirect) {
        res.json({
            user: req.user.serialize(), jwt: await req.user.createJwt()
        })
    } else {
        // TODO: Change to HTTPS Pre-Deploy
        res.redirect(`http://${req.session.oauthRedirect}?jwt=${await req.user.createJwt()}`)
    }
})

userRouter.put("/profile/connectEmail", jwtAuth, body("email").isEmail(), validatorMiddleware, async (req, res) => {
    const {email} = req.data;
    const candidate = await User.findOne({
        email
    })
    if (!candidate) {
        req.user.email = email;
        await req.user.save();
        res.json({
            user: req.user.serialize(), jwt: await req.user.createJwt()
        })
    } else {
        res.json({
            errors: [{
                msg: "Новый email уже занят"
            }]
        })
    }
});

userRouter.put("/profile/connectPhone", jwtAuth, body("phone"), validatorMiddleware, async (req, res) => {
    const {phone: _phone} = req.data;
    const phone = formatPhoneNumber(_phone);
    if (isPhoneValid(phone)) {
        const candidate = await User.findOne({
            phoneNumber: phone
        })
        if (!candidate) {
            req.user.phoneNumber = phone;
            await req.user.save();
            res.json({
                user: req.user.serialize(), jwt: await req.user.createJwt()
            })
        } else {
            res.json({
                errors: [{
                    msg: "Новый телефон уже занят"
                }]
            })
        }
    } else {
        res.json({
            errors: [{
                msg: "Телефон не валиден"
            }]
        })
    }

});

userRouter.get("/login/yandex", (req, res, next) => {
    req.session.oauthRedirect = req.query.redirect
    yaAuth(req, res, next);
})
userRouter.get("/login/yandex/redirect", yaAuth, async (req, res) => {
    if (!req.session.oauthRedirect) {
        res.json({
            user: req.user.serialize(), jwt: await req.user.createJwt()
        })
    } else {
        // TODO: Change to HTTPS Pre-Deploy
        res.redirect(`http://${req.session.oauthRedirect}?jwt=${await req.user.createJwt()}`)
    }
})

userRouter.get("/login/vk", (req, res, next) => {
    req.session.oauthRedirect = req.query.redirect
    vkAuth(req, res, next);
})
userRouter.get("/login/vk/redirect", vkAuth, async (req, res) => {
    if (!req.session.oauthRedirect) {
        res.json({
            user: req.user.serialize(), jwt: await req.user.createJwt()
        })
    } else {
        // TODO: Change to HTTPS Pre-Deploy
        res.redirect(`http://${req.session.oauthRedirect}?jwt=${await req.user.createJwt()}`)
    }
})
userRouter.get("/profile/verifyEmail", jwtAuth, async (req, res) => {
    if (!req.user.email) return res.json({
        errors: [{msg: "У вас не привязана почта чтобы её верифицаровать"}]
    })
    if (req.user.isVerifiedEmail) return res.json({
        errors: [{msg: "У вас уже верифицирована почта"}]
    })
    await req.user.sendVerifyEmailCode()
    res.json({status: true, msg: "Код отправлен."})
});

userRouter.get("/profile/verifyEmail/code", jwtAuth, async (req, res) => {
    const {code} = req.query;
    if (!code) {
        return res.json({
            errors: [{msg: "Укажить query параметр code"}]
        })
    }

    const status = await req.user.verifyEmail(code);
    if (!status) return res.json({
        errors: [{msg: "Верефикация не удалась. Проверьте код."}]
    })

    return res.json({
        status: true,
        msg: "Ваша почта успешно верефицирована."
    })
});


export default userRouter;