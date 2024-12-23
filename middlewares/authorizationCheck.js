import jwt from 'jsonwebtoken';

const authorizationCheck = (req , res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    // validate if token isn't exist
    if (!token) {
        return res.status(403).json({
            statusCode: 403,
            message: "Access Denied: No token provided",
        });
    }

    // verifying token
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                statusCode: 401,
                message: "Invalid or Expired Token, message: " + err
            });
        }

        req.user = decoded;
        next();
    })
}

export default authorizationCheck;