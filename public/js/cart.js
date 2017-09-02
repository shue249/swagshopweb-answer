var cart = {
    // adds product to cart
    'add': function(product, onSuccess) {
        var content_ids = [product.id];
        var value = product.price;
        var currency: product.currency;

        //TODO - Dynamic Ads, Exercise 4b, implement AddToCart 
        fbq('track', 'AddToCart', {
            content_type: 'product',
            content_ids: content_ids,
            value: value,
            currency: currency
        });

        $.ajax({
            url: '/addtocart?id=' + product.id,
            type: 'get',                
            dataType: 'json',
            success: function(json) {
                if (json.success) {
                    onSuccess(json);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
              alert(thrownError + '\r\n' + xhr.statusText + '\r\n' + xhr.responseText);
            }
        }); 
    },
    // removes product from cart by id
    'remove': function(id, onSuccess) {
        $.ajax({
            url: '/remove?id=' + id,
            type: 'get',                
            dataType: 'json',
            success: function(json) {
                if (json.success) {
                    onSuccess(json);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
              alert(thrownError + '\r\n' + xhr.statusText + '\r\n' + xhr.responseText);
            }
        }); 
    },
    // sums up all the item qty in the cart
    'getNumberOfItems': function(cartItems) {
        var numberOfItems = 0;
        for (i = 0; i < cartItems.length; i++) {
            numberOfItems = numberOfItems + cartItems[i].qty;
        }
        return numberOfItems;
    },
    // sums up all the (price x qty) of items in the cart
    'getTotalPrice': function(cartItems) {
        var totalPrice = 0;
        for (i = 0; i < cartItems.length; i++) {
            totalPrice = totalPrice + cartItems[i].itemTotal;
        }
        return totalPrice;                
    },
    // generates an array containing the ids for the items in the cart
    'getCartItemIdsAsList': function(cartItems) {
        content_ids = [];
        for (i = 0; i < cartItems.length; i++) {
            content_ids.push(cartItems[i].product.id);
        }
        return content_ids;         
    }    
};