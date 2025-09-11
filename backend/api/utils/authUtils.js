import jwt from 'jsonwebtoken' 
import dotenv from 'dotenv';
dotenv.config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

function generateAccessToken(user) {

    return jwt.sign({ id: user.id, firstname: user.firstname, lastname:user.lastname, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

function getRefreshToken() {
    return process.env.REFRESH_TOKEN_SECRET
}

export { authenticateToken, generateAccessToken, getRefreshToken};