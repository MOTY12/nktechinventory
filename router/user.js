const express = require(`express`)
const router = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Users = require('../model/user')
    //insert new user
router.post('/register', async(req, res) => {
    const user = new Users({
        surname: req.body.surname,
        firstname: req.body.firstname,
        Email: req.body.Email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10)
    })
    const Userssave = await user.save()

    if (!Userssave) return res.status(404).send('Unsuccessful!!! Pls try again')
    res.send(Userssave)

})

//login user user => user.name === req.body.name
router.post('/login', async(req, res) => {
    const user = await Users.findOne({ Email: req.body.Email })
        // console.log(user)
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send({ msg: 'The Email address ' + req.body.Email + ' is not associated with any account. Check your Email address and try again' });
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
                userId: user._id,
                userName: user.userName,
                Email: user.Email,
                isAdmin: user.isAdmin
            },
            secret, { expiresIn: '1d' }
        )
        return res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }).status(200).json({ message: "Logged in successfully 😊 👌" });
    } else {
        res.status(400).send('password is wrong!');
    }


})

router.get("/logout", (req, res) => {
    return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out 😏 🍀" });
});


module.exports = router