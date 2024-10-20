import {isRoleBetterOrEqual} from "../utils/roleUtils.js";

export const roleMiddleware = (role) => (req, res, next) => {
    const userRole = req.user.role;
    const needRole = role;

    if (isRoleBetterOrEqual(userRole, needRole)) {
        next();
    }
    else {
        res.status(401).json({
            errors: [
                {
                    msg: "У вас недостаточно прав."
                }
            ]
        })
    }
}