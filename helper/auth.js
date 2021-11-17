const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {

    const accessToken = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!accessToken)
        return res.status(400).json({ error: "User not Authenticated!" });

    try {
        const validToken = jwt.verify(accessToken, process.env.secret);
        req.user = validToken;

        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        console.log(err)
            // return res.status(400).json({ error: err });
    }
    // return next()
};

module.exports = { validateToken };