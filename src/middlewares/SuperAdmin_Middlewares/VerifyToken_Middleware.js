import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }
    const tokenWithoutBearer = token;
    // console.log(tokenWithoutBearer);

    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET_SUPER_ADMIN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        // console.log("Decoded token: ", req.user);
        next();
    });
};