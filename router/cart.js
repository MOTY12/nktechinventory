const { Order } = require('../model/cart');
const express = require('express');
const { OrderItem } = require('../model/cart-item');
const { validateToken } = require('../helper/auth')
const router = express.Router();

router.get(`/cart`, validateToken, async(req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList);
})

router.get(`/:id`, validateToken, async(req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                populate: 'category'
            }
        });

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order);
})




router.post('/cart', async(req, res) => {
    try {
        const orderItemsIds = Promise.all(req.body.orderItems.map(async(orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;
        }))
        const orderItemsIdsResolved = await orderItemsIds;

        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async(orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }))

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            customerAddress: req.body.customerAddress,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        })
        order = await order.save();

        if (!order)
            return res.status(400).send('the order cannot be created!')

        res.send(order);
    } catch (err) {
        console.log(err)
    }
})

module.exports = router