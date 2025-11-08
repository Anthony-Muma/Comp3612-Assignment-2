import { addToCart, removeFromCart, cartObject } from "./cartLogic.js";
import { groupColors } from "./browseLogic.js"

// Loading Page
function renderBrowseProducts(products) {

    const productTemplate = document.querySelector("#browse-product-template");
    const parent = document.querySelector("#filtered-product-container");
    
    for (let product of products) {
        const clone = productTemplate.content.cloneNode(true);
        
        const browseProduct = clone.querySelector(".browse-product")
        const title = clone.querySelector(".title");
        const price = clone.querySelector(".price");

        browseProduct.dataset.productId = `${product.id}`;
        title.textContent = `${product.name}`;
        price.textContent = `${product.price}`;

        parent.appendChild(clone);
    }

    // Events
    parent.addEventListener("click", (e)=>{
        const element = e.target;
        if (element.classList.contains("add-to-cart")) {
            const selectedProductId = element.parentNode.dataset.productId;
            const productData = products.find(element => element.id == selectedProductId)
            addToCart(productData)
        // Temp
        } else if (element.nodeName == "P") {
            const selectedProductId = element.parentNode.dataset.productId;
            const productData = products.find(element => element.id == selectedProductId)
            removeFromCart(productData)
        }
    });
    
    //Sort functions
    
   console.log(groupColors(products))
    const nameSort = function(a,b) {
        const titleA = a.querySelector(".title").textContent;
        const titleB = b.querySelector(".title").textContent;
        if (titleA > titleB) return 1
        else if (titleA < titleB) return -1
        else return 0
        

    }
    const priceSort = function(a,b) {
        const priceA = a.querySelector(".price").textContent;
        const priceB = b.querySelector(".price").textContent;
        return priceB - priceA;
    }

    //Filter Functions


    const elements = Array.from(parent.querySelectorAll(".browse-product"))
    
    elements.sort(priceSort);

    parent.innerHTML = '';
    for (let element of elements) {
        parent.appendChild(element)
    }
}

function renderBrowse(products) {
    renderBrowseProducts(products);
}

function loadCart() {
    let cartData = JSON.parse(localStorage.getItem("cart"));

    if (!cartData) {
        cartData = localStorage.setItem("cart", JSON.stringify(cartObject));
    }

    // Render Cart stuff
    const cartButtonNumber = document.querySelector("#nav-cart span");
    cartButtonNumber.textContent = cartData.quantity;

    const cartProductContainer = document.querySelector("#cart-product-container")
    // ----

    cartProductContainer.addEventListener("click", (e)=>{
        const element = e.target;
        if (element.classList.contains("remove-from-cart")) {

        }
    });

    
}

function renderAll(products) {
    renderBrowse(products);
    loadCart();
}

// JSON Stuff
function loadLocalJson(filePath) {
    fetch(filePath)
    .then(response => response.json())
    .then(data => {
        return data;
    });
}

// Example usage (assuming 'data.json' is in the same directory or accessible via a relative path)


// hides 
function swapView(articleId) {
    const articles = document.querySelectorAll("main article");
    for (let article of articles) {
        console.log(article.id)
        if (article.id == articleId) {
            // make hidden
            
            article.style.display = "block"
        } else {
            article.style.display = "none"
            // make hidden
        }
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    console.log("DOM loaded");

    //Event
    document.querySelector("#nav-home").addEventListener("click", ()=>{swapView("home")});
    document.querySelector("#nav-women").addEventListener("click", ()=>{swapView("women")});
    document.querySelector("#nav-men").addEventListener("click", ()=>{swapView("men")});
    document.querySelector("#nav-browse").addEventListener("click", ()=>{swapView("browse")});
    document.querySelector("#nav-cart").addEventListener("click", ()=>{swapView("cart")});
    

    const productData = localStorage.getItem("productData")
    
    if (!productData) {
        fetch("./data/data-minifed.json")
        .then(response => response.json())
        .then(data => {
            // Process your JSON data here
            localStorage.setItem("productData", JSON.stringify(data))
            renderAll(data);
        });
                
    } else {
        renderAll(JSON.parse(productData));
    }
});



