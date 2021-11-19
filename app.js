const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const inventoryRouter = require('./router/inventory')
const userRouter = require('./router/user')
const cartRouter = require('./router/cart')
    // const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');

dotenv.config()

const apis = process.env.API_URL
const mongoURI = process.env.DBCONNECT

app.use(errorHandler);
app.use(express.json())
    // app.use(authJwt());

app.use(`${apis}`, inventoryRouter)
app.use(`${apis}`, userRouter)
app.use(`${apis}`, cartRouter)


app.get('/', (req, res) => {
    res.send('helo world')
})


//configuring the database
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('connected to the database') }).catch((err) => {
    // console.log('not connect to db')
    console.log(err)
})




app.listen(process.env.PORT || 4000)