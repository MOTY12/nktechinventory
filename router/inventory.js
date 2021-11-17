const express = require(`express`)
const router = express()
const Inventorys = require('../model/inventory')


router.get('/product', async(req, res) => {
    const userlist = await Inventorys.find()
    res.json(userlist)
    if (!userlist) {
        res.status(500).json({
            success: false,
            message: "no classes"
        })
    }
})

//insert new user
router.post('/product', async(req, res) => {
    const user = new Inventorys({
        name: req.body.name,
        price: req.body.price
    })
    Inventoryssave = await user.save()

    if (!Inventoryssave)
        return res.status(404).send('Inventorys cannot be created')

    res.send(Inventoryssave)

})

//update product
router.put('/product/:id', async(req, res) => {
    const updateproduct = await Inventorys.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity
        }, {
            new: true
        }
    )
    if (!updateproduct) {
        res.status(500).json({
            success: false,
            message: "the product cannot be found"
        })
    } else {
        res.send(updateproduct)
    }

})


//delete product
router.delete('/product/:id', async(req, res) => {
    const product = await Inventorys.findByIdAndRemove(req.params.id)
        .then(product => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: "the product is deleted"
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: "the product cannot be found"
                })
            }
        }).catch(err => {
            return res.status(400).json({
                success: false,
                error: err
            })
        })
})


module.exports = router