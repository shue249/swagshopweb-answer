'use strict';
var express = require('express');
var router = express.Router();

/*=========
 Data Init
==========*/
var loginUser = null;
var products = [
        { id: 'swag1', name: 'BattleHack 2015 Sticker Set', description: 'Collector\'s Edition. Gotta catch\'em all!', price: 3.00, currency: 'USD', image: '/images/swag1.jpg' },
        { id: 'swag2', name: 'Braintree_Dev Earphones', description: 'Listen in style :)', price: 10.00, currency: 'USD', image: '/images/swag2.jpg' },
        { id: 'swag3', name: 'Smart Home Kit', description: 'PYH - Pimp your home!', price: 99.99, currency: 'USD', image: '/images/swag3.jpg' }
    ];
var productsById = [];
for (var i = 0; i < products.length; i++) {
    productsById[products[i].id] = products[i];
}
var cartItems = [];

/*=========
 Cart Functions
===========*/

function getCartItem(product) {
    var foundCartItems = cartItems.filter(
        function(cartItem){ return cartItem.product.id === product.id }
    );
    return (foundCartItems.length > 0) ? foundCartItems[0] : null;
}

function removeCartItem(product) {
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].product.id === product.id) {
            cartItems.splice(i, 1);
            break;
        }
    }
}

/*======
 Routes
=======*/
router.get('/', function(req, res) {
    res.render('index', {products, cartItems, loginUser});
});

router.get('/login', function(req, res) {
  var originUrl = req.header('Referer') || '/';
    loginUser = { email: 'johnsmith@example.com', firstname: 'John', lastname: 'Smith', phone: '010-123456789' };
    res.redirect(originUrl);
});

router.get('/logout', function(req, res) {
    var originUrl = req.header('Referer') || '/';
    loginUser = null;
    res.redirect(originUrl);
});

router.get('/contactus', function(req, res) {
    res.render('contactus', {loginUser});
});

router.get('/shipping', function(req, res) {
    res.render('shipping', {loginUser});
});

router.get('/product', function(req, res) {
    var product = productsById[req.query.id];
    res.render('product', {product, cartItems, loginUser});
});

router.get('/addtocart', function(req, res) {
    var product = productsById[req.query.id];
    var cartItem = getCartItem(product);
    if (cartItem) {
        cartItem.qty = cartItem.qty + 1;
        cartItem.itemTotal = parseFloat(cartItem.qty) * parseFloat(cartItem.product.price);
    } else {
        cartItems.push({product: product, qty: 1, itemTotal: product.price});
    }
    res.send({success: true, cartItems});
});

router.get('/remove', function(req, res) {
    var product = productsById[req.query.id];
    removeCartItem(product);
    res.send({success: true, cartItems});
});

router.get('/checkout', function(req, res) {
    res.render('checkout', {cartItems, loginUser});
});

router.get('/purchase', function(req, res) {
    console.log('Successful purchase for');
    console.log(cartItems);
    var purchasedItems = cartItems;
    cartItems = [];
    res.render('success', {success: true, purchasedItems, loginUser});
});

router.get('/leadgen', function(req, res) {
    console.log(req.query);
    if (req.query) {
        if (req.query['hub.challenge'] && req.query['hub.verify_token']) {
            console.log('Hub challenge = ' + req.query['hub.challenge']);
            console.log('Hub verify token = ' + req.query['hub.verify_token']);            
            res.send(req.query['hub.challenge']);
        } else {
            res.send({success: false, reason: 'Missing hub.challenge and hub.verify_token params'})
        }
    } else {
        res.send({success: false, reason: 'Empty request params'})
    }
});

router.post('/leadgen', function(req, res) {
    var entry = req.body.entry;
    console.log('ENTRY = ' + JSON.stringify(entry));
    for (var i = 0; i < entry.length; i++) {
        var changes = entry[i].changes;
        console.log('CHANGES = ' + JSON.stringify(changes));
        for (var j = 0; j < changes.length; j++) {
            console.log('LEAD = ' + JSON.stringify(changes[j]));
        }
    }
});

module.exports = router;
