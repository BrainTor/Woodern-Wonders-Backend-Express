import {UserRoles} from "../models/User.js";

export function isRoleBetterOrEqual(userRole, needRole) {
    const roles = Object.values(UserRoles);
    const userRoleIndex = roles.indexOf(userRole);
    const needRoleIndex = roles.indexOf(needRole);
    return userRoleIndex >= needRoleIndex;
}