import passport from "passport";
export const localAuth = passport.authenticate('local', { keepSessionInfo: true });
export const jwtAuth = passport.authenticate('jwt', { keepSessionInfo: true })
export const googleAuth = passport.authenticate('google', {keepSessionInfo:true});
export const yaAuth = passport.authenticate('yandex', {keepSessionInfo:true});
export const vkAuth = passport.authenticate('vk', {keepSessionInfo:true});