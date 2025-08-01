import jwt from "jsonwebtoken";

export const jwtSignFn =  async (payload, expireTime) => {
    return await jwt.sign(payload, process.env.JWT_SECRET_KEY, expireTime)
}

export const jwtVerifyFn = async (token) => {
    return await jwt.verify(token, process.env.JWT_SECRET_KEY)
}