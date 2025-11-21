//import { addToCart, removeFromCart, cartObject } from "./cartLogic.js";
import { addToCart, renderCart, removeFromCart} from "./WIP/cart.js";
import { renderBrowse, addFilter} from "./WIP/browse.js"

function loadBrowse(products) {
    renderBrowse(products);
    addFilter(products, {gender : "mens"});
    addFilter(products, {category : "Outerwear"});
    // Browse Events
    document.querySelector("#filtered-product-container").addEventListener("click", (e)=>{
        const element = e.target;
        if (element.classList.contains("add-to-cart")) {
            const selectedProductId = element.parentNode.dataset.productId;
            const productData = products.find(element => element.id == selectedProductId)
            addToCart(productData);
        } else if (element.nodeName == "P") {
            // ...
        }
    });
}

function loadCart(products) {
    renderCart(products);

    // Cart Events
    document.querySelector("#cart-product-container").addEventListener("click", (e) => {
        const element = e.target;

        if (element.classList.contains("remove-from-cart")) {
            const parent = element.closest(".cart-product");
            removeFromCart(parent.dataset.productId,parent.dataset.size,parent.dataset.color, parent); // Add color and size
        }
    });
}
function renderAll(products) {
    loadBrowse(products)
    loadCart(products);
    
}

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
    
    swapView("home");

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



