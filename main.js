//import { addToCart, removeFromCart, cartObject } from "./cartLogic.js";
import { addToCart, renderCart, removeFromCart} from "./WIP/cart.js";
import { initBrowse, addFilter, removeFilter, clearAllFilters, changeSort} from "./WIP/browse.js"
import { initGenderView } from "./WIP/genderview.js";
import { initHome } from "./WIP/home.js";
import { initGroup, COLOR_GROUPS } from "./color.js";
import { initGrouping, retrieve } from "./grouping.js";
// import { initHome } from "./WIP/home.js";

// function loadHome(products) {
//     initHome(products);


// }
function loadBrowse(products) {
    // Init Browse
    initBrowse(products);

    // Browse Events

    // Product Container Events
    const productContainer = document.querySelector("#filtered-product-container");
    productContainer.addEventListener("click", (e)=>{
        const element = e.target;

        // Add To Cart TODO: changed to view product
        if (element.classList.contains("add-to-cart")) {
            // CLEAN
            const selectedProductId = element.parentNode.dataset.productId;
            const productData = products.find(element => element.id == selectedProductId)
            addToCart(productData); // Change to product view
        }

    });

    // Filter Tag Events
    const filterTagContainer = document.querySelector("#active-filters");
    filterTagContainer.addEventListener("click", (e)=>{
        const element = e.target;

        // Remove Filter Via Tag
        if (element.classList.contains("filter-button")) {
            removeFilter(products, element.dataset.key, element.dataset.value);

        // Remove All Filters Via Tag
        } else if (element.id="clear-filter") {
            clearAllFilters(products);
        }
    });

    // Filter Menu Container Events
    const filterMenuContainer = document.querySelector("#filter")
    filterMenuContainer.addEventListener("click", (e)=>{
        const element = e.target;

        // Filter Dropdown Logic
        if (element.classList.contains("filter-toggle")) {
            //...

        // Filter Option
        } else if (element.classList.contains("filter-button")) {

            // Remove Filter Via Filter Option
            if (element.classList.contains("active")) {
                removeFilter(products, element.dataset.key, element.dataset.value);

            // Apply Filter Via Filter Option
            } else {
                addFilter(products, element.dataset.key , element.dataset.value);
            }
        }

    });
}

function loadGenderView(products) {
    // Init
    initGenderView(products);

    function onClickCategories(e) {
        const element = e.target
        console.log(e.nodeName);
        if (element.dataset.category || element.parentNode.dataset.category) {
            const gender = element.dataset.gender ?? element.parentNode.dataset.gender;
            const category = element.dataset.category ?? element.parentNode.dataset.category;
            console.log(category);
            // apply filter
            clearAllFilters(products);
            addFilter(products, "gender", gender);
            addFilter(products, "category", category);

            // switch view
            swapView("browse");
        }
    }

    const mensCategories = document.querySelector("#mens-categories");
    mensCategories.addEventListener("click", onClickCategories);

    const womensCategories = document.querySelector("#womens-categories");
    womensCategories.addEventListener("click", onClickCategories);

    // Add events for featured

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


function loadAll(products) {
    loadBrowse(products);
    loadGenderView(products);
    loadCart(products);
    
}

// hides 
function swapView(articleId) {
    const articles = document.querySelectorAll("main article");
    for (let article of articles) {
        if (article.id == articleId) {
            // make hidden
            
            article.style.display = "block"
        } else {
            article.style.display = "none"
            // make hidden
        }
    }
}

function aboutPopupOpen() {

}

function aboutPopupClose() {

}

document.addEventListener("DOMContentLoaded", ()=>{
    // Swap Event
    document.querySelector("#nav-home").addEventListener("click", ()=>{swapView("home")});
    document.querySelector("#nav-women").addEventListener("click", ()=>{swapView("women")});
    document.querySelector("#nav-men").addEventListener("click", ()=>{swapView("men")});
    document.querySelector("#nav-browse").addEventListener("click", ()=>{swapView("browse")});
    document.querySelector("#nav-cart").addEventListener("click", ()=>{swapView("cart")});
    
    swapView("home");

    // About setup
    document.querySelector("#nav-about").addEventListener("click", ()=>{aboutPopupOpen()});

    const productData = localStorage.getItem("productData")
    
    if (!productData) {
        fetch("./data/data-minifed.json")
        .then(response=>{
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("fetch failed")
            }
        })
        .then(data=>{
            initGroup(data);
            initGrouping(data);
            localStorage.setItem("productData", JSON.stringify(data))
            loadAll(data);

        })
        // .catch(err=>{
        //     alert(err);
        // });
                
    } else {
        initGrouping(JSON.parse(productData));
        retrieve(["mens"],["Bottoms", "Tops"],["M","XS",'0']);
        loadAll(JSON.parse(productData));
    }
});



