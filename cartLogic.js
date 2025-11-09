// Assuming cart was created
/*
    cart = {
        quantity : 0
        content : [
            {
                id : 000,
                color : #000000 -- Maybe...
                quantity : 1 
            }, ...
        ]
    }

*/

// TODO, localStorage.setItem("cart", JSON.stringify(cartObject))
export const cartObject = {
    quantity: 0,
    content : []
}

export function addToCart(singleProductData) {
    //localStorage.setItem("cart", JSON.stringify(cartObject))
    const cartData = JSON.parse(localStorage.getItem("cart"))
    const item = cartData.content.find(item => (item.id == singleProductData.id))
    if (item) {
        //Logic

        item.quantity += 1;
        cartData.quantity += 1;
        // update cart HTML

        
    } else {
        // Logic
        cartData.content.push({id : singleProductData.id, quantity : 1});
        cartData.quantity += 1;

        // update cart HTML
 
    }
    
    //update cart icon button

    const cartButtonNumber = document.querySelector("#nav-cart span");
    cartButtonNumber.textContent = cartData.quantity;

    //...
    localStorage.setItem("cart", JSON.stringify(cartData))
}

export function removeFromCart(singleProductData) {
    const cartData = JSON.parse(localStorage.getItem("cart"))
    const item = cartData.content.find(element => element.id == singleProductData.id)
    if (item) {
        item.quantity -= 1;
        // Remove cart item if item quantity <= 0
        if (item.quantity <= 0) {
            cartData.content = cart.content.filter(element => element.id != item.id);
            // Remove Item HTML

        } else {
            

        }
        cartData.quantity -= 1;
        // update cart HTML
    }
    
    //update cart related html

    const cartButtonNumber = document.querySelector("#nav-cart span")
    cartButtonNumber.textContent = cartData.quantity

    //...
    localStorage.setItem("cart", JSON.stringify(cartData))
}

//-------------------------------------------------------
export function displayCartItems() {
    
}