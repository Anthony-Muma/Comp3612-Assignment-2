// OBJECT CONSTRUCTORS

function singleCartItemObject (id, quantity, name, price, color, size) {
  this.id = id;
  this.quantity = quantity;
  this.name = name;
  this.price = price;
  this.color = color;
  this.size = size;
}

function cartObject() {
    this.quantity = 0,
    this.content = []
}

// HTML STUFF -------------------------------------------------------------------------------

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
 * @param {*} cartItemData 
 */
function createSingleCartProductHtml(cartItemData) {
    const container = document.querySelector("#cart-product-container");
    const template = document.querySelector("#cart-product-template");
    const clone = template.content.cloneNode(true);

    clone.querySelector(".title").textContent = cartItemData.name;
    clone.querySelector(".quantity").textContent = cartItemData.quantity;

    clone.querySelector(".cart-product").dataset.productId = cartItemData.id
    clone.querySelector(".cart-product").dataset.color = cartItemData.color
    clone.querySelector(".cart-product").dataset.size = cartItemData.size

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
    element.remove();
}

function updateCartButton(cartData) {
    const cartButtonNumber = document.querySelector("#nav-cart span");
    cartButtonNumber.textContent = cartData.quantity;
}

// LOGIC -------------------------------------------------------------------------------

export function addToCart(productData, quantity=1, color="#ffffff", size="M") { //
    //localStorage.setItem("cart", JSON.stringify(cartObject))
    const cartData = JSON.parse(localStorage.getItem("cart"));
    let cartItemData = cartData.content.find(item => (item.id == productData.id)); // When size and color are add, adjust condition
    
    // Check if product was found within cart
    if (cartItemData) {

        //Logic
        cartItemData.quantity += quantity;
        cartData.quantity += quantity;

        // update cart HTML
        const cartItemHtml = document.querySelector(`#cart-product-container [data-product-id='${productData.id}']`);
        updateCartProductHtml(cartItemHtml, cartItemData)
        
    // Create cart item if DNE  
    } else {

        // Logic
        cartItemData = new singleCartItemObject(productData.id, quantity, productData.name, productData.price, color, size)
        cartData.content.push(cartItemData);
        cartData.quantity += quantity;

        // create cart HTML
        createSingleCartProductHtml(cartItemData);

    }
    
    //update cart icon button
    updateCartButton(cartData);
    
    //...
    localStorage.setItem("cart", JSON.stringify(cartData));
}

export function removeFromCart(id, cartElement) { // Add Color and Size
    const cartData = JSON.parse(localStorage.getItem("cart"));
    const cartItemDataIndex = cartData.content.findIndex(item => (item.id == id)); // When size and color are add, adjust condition
    let cartItemData = cartData.content[cartItemDataIndex];

    // Check if product was found within cart
    if (cartItemData) {
      //Logic
      cartItemData.quantity -= 1;
      cartData.quantity -= 1;

      // update cart HTML
      updateCartProductHtml(cartElement, cartItemData);
      if (cartItemData.quantity <= 0) {
        cartData.content.splice(cartItemDataIndex, 1);
        removeCartProductHtml(cartElement);
      }
      
      if (cartData.quantity <= 0) {
        cartData.quantity = 0
        // Display cart empty
      }
    }

    //update cart icon button
    updateCartButton(cartData);
    
    //...
    localStorage.setItem("cart", JSON.stringify(cartData));
}

// MAIN -------------------------------------------------------------------------------

export function renderCart(products) {
  let cartData = JSON.parse(localStorage.getItem("cart"));

  // Render Existing Cart
  if (cartData) {
    cartData.content.forEach(cartItemData => {createSingleCartProductHtml(cartItemData);});

  // Create cart within local storage
  } else {
    cartData = new cartObject();
    localStorage.setItem("cart", JSON.stringify(cartData));
  }
  
  // Display correct cart count
  updateCartButton(cartData);
}