const jwt = require('jsonwebtoken')
const config = require('config')
const secret = config.get('jwtSecret')


function auth(req, res, next) {

    const token = req.header('x-auth-token');
    //check if token exist 
    if (!token) return res.status(401).json({ msg: "no token,authorization denied" });

    try {
        //verify token
        const decoded = jwt.verify(token, secret);
        //add user from payload
        req.user = decoded;

        next();
    }
    catch (e) {
        res.status(400).json({ msg: "token is not valid" })
    }
}

module.exports = auth;