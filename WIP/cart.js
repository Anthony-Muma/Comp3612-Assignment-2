import { showToast } from "./toast.js";
// OBJECT CONSTRUCTORS

function singleCartItemObject(id, quantity, name, price, color, size) {
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

  clone.querySelector(".price").textContent = money(cartItemData.price); //formatted price

  const lineTotal = cartItemData.price * cartItemData.quantity;
  clone.querySelector(".subtotal").textContent = money(lineTotal); // subtotal for one specific row

  clone.querySelector(".size").textContent = cartItemData.size // size
  const colorBox = clone.querySelector(".cart-color");

  colorBox.style.backgroundColor = cartItemData.color;
  colorBox.title = cartItemData.color;


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

export function addToCart(productData, quantity = 1, color = "#ffffff", size = "M") { //
  //localStorage.setItem("cart", JSON.stringify(cartObject))
  const cartData = JSON.parse(localStorage.getItem("cart"));
  let cartItemData = cartData.content.find(item =>
    item.id === productData.id &&
    item.color === color &&
    item.size === size
  ); // When size and color are add, adjust condition

  // Check if product was found within cart
  if (cartItemData) {

    //Logic
    cartItemData.quantity += quantity;
    cartData.quantity += quantity;

    // update cart HTML
    const rowSelect = `#cart-product-container [data-product-id='${productData.id}'][data-color='${color}'][data-size='${size}']`
    const cartItemHtml = document.querySelector(rowSelect);
    updateCartProductHtml(cartItemHtml, cartItemData);
    //update subtotal column
    const newSubTotal = cartItemData.price * cartItemData.quantity;
    cartItemHtml.querySelector(".subtotal").textContent = money(newSubTotal);


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
  updateOrderSummary();
}

export function removeFromCart(id, size, color, cartItemHtml) { // Add Color and Size
  const cartData = JSON.parse(localStorage.getItem("cart"));
  const cartItemDataIndex = cartData.content.findIndex(item => (item.id == id && item.size == size && item.color == color)); // When size and color are add, adjust condition
  let cartItemData = cartData.content[cartItemDataIndex];

  // Check if product was found within cart
  if (cartItemData) {
    //Logic
    cartItemData.quantity -= 1;
    cartData.quantity -= 1;

    // update cart HTMLp
    updateCartProductHtml(cartItemHtml, cartItemData);
    //*NOTE TO ANT THIS CAN BE TURNED INTO A FUNCTION OR CONDENSED INTO UPDATECARTPRODUCT
    const newSubTotal = cartItemData.price * cartItemData.quantity;
    cartItemHtml.querySelector(".subtotal").textContent = money(newSubTotal);
    if (cartItemData.quantity <= 0) {
      cartData.content.splice(cartItemDataIndex, 1);
      removeCartProductHtml(cartItemHtml);
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
  updateOrderSummary();
}

// MAIN -------------------------------------------------------------------------------
export function renderCart(products) {
  let cartData = JSON.parse(localStorage.getItem("cart"));
  const container = document.querySelector("#cart-product-container");

  // Clear previous items to prevent duplicates on re-render
  container.innerHTML = "";

  // Render Existing Cart
  if (cartData && cartData.content.length > 0) {
    cartData.content.forEach(cartItemData => {
      createSingleCartProductHtml(cartItemData);
    });
  } else {
    // If no cart exists, create empty one
    if (!cartData) {
      cartData = new cartObject();
      localStorage.setItem("cart", JSON.stringify(cartData));
    }
  }


  // 1. Update the nav button
  updateCartButton(cartData);

  // 2. Attach Listeners for Shipping/Checkout
  const destSelect = document.querySelector("#cart-destination");
  const methodSelect = document.querySelector("#cart-shipping-method");
  const checkoutBtn = document.querySelector("#btn-checkout");


  //can just use .onchange = 
  destSelect.onchange = updateOrderSummary;
  methodSelect.onchange = updateOrderSummary;
  checkoutBtn.onclick = handleCheckout;

  // 3. Initial Calculation
  updateOrderSummary();

}



// 1. Currency Formatter https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/
const money = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

// 2. Shipping Logic Matrix
const getShippingCost = (destination, method) => {
  const rates = {
    'Canada': { 'Standard': 10, 'Express': 25, 'Priority': 35 },
    'US': { 'Standard': 15, 'Express': 25, 'Priority': 50 },
    'Int': { 'Standard': 20, 'Express': 30, 'Priority': 50 }
  };
  return rates[destination][method];
};

// 3.Calculation Logic
function updateOrderSummary() {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  if (!cartData) return;

  // A. Calculate Merchandise Total
  const merchTotal = cartData.content.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  //@Anthony, this basically just takes an accumulator sum and increments it for each (item * quantity)
  // the 0 parameter is what sum starts at.

  // B. Get selected dropdown values
  const dest = document.querySelector("#cart-destination").value;
  const method = document.querySelector("#cart-shipping-method").value;

  // C. Calculate Shipping (Free if > $500)
  let shipCost = (merchTotal > 500) ? 0 : getShippingCost(dest, method);

  // D. Calculate Tax, apply 5% if canada else 0
  let tax = (dest === 'Canada') ? (merchTotal + shipCost) * 0.05 : 0;

  // E. Update HTML Elements
  document.querySelector("#summary-merchandise").textContent = money(merchTotal);
  document.querySelector("#summary-shipping").textContent = (shipCost === 0) ? "Free" : money(shipCost);
  document.querySelector("#summary-tax").textContent = money(tax);
  document.querySelector("#summary-total").textContent = money(merchTotal + shipCost + tax);
  document.querySelector("#tax-label").textContent = (dest === 'Canada') ? "(5% GST)" : "(0%)";

  // F. Toggle Empty State visibility
  const isEmpty = cartData.content.length === 0;
  document.querySelector("#cart-empty-message").classList.toggle("hidden", !isEmpty);
  document.querySelector("#cart-footer").classList.toggle("hidden", isEmpty);

  // Disable checkout if empty
  document.querySelector("#btn-checkout").disabled = isEmpty;
}

// 4. Checkout Logic
function handleCheckout() {
  localStorage.removeItem("cart");
  showToast("Order placed! Returning to home.");
  document.querySelector("#nav-home").click(); // Navigate home

  const emptyCart = { quantity: 0, content: [] };
  localStorage.setItem("cart", JSON.stringify(emptyCart)); //forgot to set a new cart on checkout
  //TODO must reset the checkout /footer
  document.querySelector("#cart-footer").classList.toggle("hidden");
  document.querySelector("#cart-empty-message").classList.toggle("hidden");


  // Reset UI
  document.querySelector("#cart-product-container").innerHTML = "";
  updateCartButton({ quantity: 0 });
}