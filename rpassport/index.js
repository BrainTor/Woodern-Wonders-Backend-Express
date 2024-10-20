import passport from "passport";
import secret from "../utils/secret.js";
import User from "../models/User.js";
import GoogleStrategy from 'passport-google-oauth20';
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import LocalStrategy from "passport-local";
import {Strategy as YandexStrategy} from "passport-yandex";
import {translit} from "../utils/translit.js";
import {Strategy as VKStrategy} from "passport-vkontakte";


passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, user._id);
    });
});
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        User.findById(user).then(user => cb(null, user)).catch(err => cb(err, null))
    });
});
passport.use("local", new LocalStrategy({
    usernameField: "login", passwordField: "password", passReqToCallback: true
}, function verifyLocal(req, username, password, done) {
    User.findOne({login: username}).then(user => {
        if (!user) {
            return done(null, false);
        }
        if (!user.comparePassword(password)) {
            return done(null, false);
        }
        return done(null, user);
    }).catch(err => {
        if (err) {
            return done(err);
        }

    });
}))

passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: secret
}, function (jwt_payload, done) {
    User.findOne({id: jwt_payload._id}).then((user) => {
        if (user) {
            return done(null, user);
        } else {
            return done(null, null);
        }
    }).catch((err) => {
        if (err) {
            return done(err, false);
        }
    })
}));

passport.use("google", new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: "/user/login/google/redirect",
    scope: ['profile', 'email']
}, function verify(accessToken, refreshToken, profile, cb) {
    const createNew = async () => {
        const u = new User({
            googleId: profile.id, login: `${translit(profile.displayName)}`, email: profile.emails[0].value, isVerifiedEmail: true
        })

        await u.save();
        cb(null, u);
    }
    User.findOne({
        googleId: profile.id
    }).then(user => {
        if (!user) {
            User.findOne({
                email: profile.emails[0].value
            }).then(user2 => {
                if (!user2) {
                    createNew()
                } else {
                    user2.googleId = profile.id;
                    user2.save().then(() => cb(null, user2))

                }
            })
        } else {
            cb(null, user);
        }
    })
}));

/*
export interface Profile {
    id: string;
    provider: string;
    displayName?: string;
    emails?: {value: string}[];
    gender?: string;
    username?: string;
    photos?: {
        value: string;
        type?: string;
    }[];
    [key: string]: any
}
 */
passport.use(new YandexStrategy({
    clientID: process.env.YANDEX_CLIENT_ID,
    clientSecret: process.env.YANDEX_CLIENT_SECRET,
    callbackURL: process.env.YANDEX_REDIRECT_URL
}, function (accessToken, refreshToken, profile, cb) {
    const createNew = async () => {
        const u = new User({
            yaId: profile.id, login: `${translit(profile.displayName)}`, email: profile.emails[0].value, isVerifiedEmail: true
        })

        await u.save();
        cb(null, u);
    }
    User.findOne({
        yaId: profile.id
    }).then(user => {
        if (!user) {
            User.findOne({
                email: profile.emails[0].value
            }).then(user2 => {
                if (!user2) {
                    createNew()
                } else {
                    user2.yaId = profile.id;
                    user2.save().then(() => cb(null, user2))
                }
            })
        } else {
            cb(null, user);
        }
    })
}));

passport.use("vk", new VKStrategy({
    clientID: process.env.VK_CLIENT_ID,
    clientSecret: process.env.VK_CLIENT_SECRET,
    callbackURL: process.env.VK_REDIRECT_URL,
    scope: ["email"]
}, (accessToken, refreshToken, params, profile, cb) => {
    const createNew = async () => {
        const u = new User({
            vkId: profile.id, login: `${translit(profile.displayName)}`, email: profile.emails[0].value, isVerifiedEmail: true
        })

        await u.save();
        cb(null, u);
    }
    User.findOne({
        vkId: profile.id
    }).then(user => {
        if (!user) {
            User.findOne({
                email: profile.emails[0].value
            }).then(user2 => {
                if (!user2) {
                    createNew()
                } else {
                    user2.vkId = profile.id;
                    user2.save().then(() => cb(null, user2))
                }
            })
        } else {
            cb(null, user);
        }
    })
}))