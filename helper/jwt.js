const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        sisRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/inventory\/product(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/inventory\/cart(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            `${api}/login`,
            `${api}/users/register`,
        ]
    })
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true)
    }

    done();
}



module.exports = authJwt