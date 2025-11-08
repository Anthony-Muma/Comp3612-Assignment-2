// RENDER STUFF

// Example productData
/** @type {productData} */
const productData = {
    "id": "P074",
    "name": "Platform Sneakers",
    "gender": "womens",
    "category": "Shoes",
    "description": "On-trend platform sneakers with chunky sole and leather upper. Comfort with height boost.",
    "price": 298,
    "cost": 135,
    "color": [
      {
        "name": "White",
        "hex": "#FFFFFF"
      }
    ],
    "sizes": [
      "6",
      "7",
      "8",
      "9",
      "10"
    ],
    "material": "Leather",
    "sales": {
      "domestic": 445,
      "international": 189,
      "total": 634
    }
  }

//Example single Cart Item Data
/*
    {
        id : 000,
        color : #000000 -- Maybe...
        quantity : 1 
    }, ...
*/

/**
 * This is a brief description of the function's purpose.
 *
 * @param {string} param1 - Description of the first parameter.
 * @param {number} [param2=0] - Description of the second parameter, which is optional and defaults to 0.
 * @returns {boolean} - Description of what the function returns.
 * @throws {Error} - Description of potential errors the function might throw.
 * @example
 * // Example usage:
 * const result = myFunction("hello", 10);
 * console.log(result); // true
 */

/**
 * 
 * @param {productData} productData 
 * @param {*} cartItemData 
 */
function createSingleCartProductHtml(productData, cartItemData) {
    const container = document.querySelector("#cart-product-container");
    const template = document.querySelector("#cart-product-template");
    const clone = template.content.cloneNode(true);

    clone.querySelector(".title").textContent = productData.name;
    clone.querySelector(".quantity").textContent = cartItemData.quantity;
    clone.querySelector(".cart-product").dataset.productId = productData.id

    container.appendChild(clone);
}

/**
 * 
 * @param {*} element 
 * @param {*} cartItemData 
 */
function updateCartProductHtml(element, cartItemData) {
    element.querySelector(".quantity").textContent = cartItemData.quantity;
}

function removeCartProductHtml(element) {
    element.removeNode
}

function updateCartButton(cartData) {
    const cartButtonNumber = document.querySelector("#nav-cart span");
    cartButtonNumber.textContent = cartData.quantity;
}

// LOGIC

export function addToCart(productData) {
    //localStorage.setItem("cart", JSON.stringify(cartObject))
    const cartData = JSON.parse(localStorage.getItem("cart"))
    const cartItemData = cartData.content.find(item => (item.id == productData.id))
    if (cartItemData) {

        //Logic
        cartItemData.quantity += 1;
        cartData.quantity += 1;

        // update cart HTML
        const cartItemHtml = document.querySelectorAll(`#cart-product-container [data-id='${productData.id}']`);
        updateCartProductHtml(cartItemHtml, cartItemData)
        

    // Create cart item if DNE  
    } else {

        // Logic
        cartData.content.push({id : productData.id, quantity : 1});
        cartData.quantity += 1;

        // create cart HTML
        createSingleCartProductHtml(productData, cartItemData)

    }
    
    //update cart icon button
    updateCartButton(cartData)
    
    //...
    localStorage.setItem("cart", JSON.stringify(cartData))
}

