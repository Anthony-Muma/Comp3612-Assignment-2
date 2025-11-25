import { initCart, addToCart, removeFromCart} from "./WIP/cart.js";
import { initBrowse, addFilter, removeFilter, clearAllFilters, changeSort} from "./WIP/browse.js"
import { initGenderView } from "./WIP/genderview.js";
import { initGrouping } from "./grouping.js";
import {populateSingleProduct}  from "./WIP/singlepage.js"

function loadBrowse(products) {
    // Init Browse
    initBrowse(products);

    // Product Container Events
    const productContainer = document.querySelector("#filtered-product-container");
    productContainer.addEventListener("click", (e)=>{
        const element = e.target;

        // Add To Cart TODO: changed to view product
        if (element.classList.contains("add-to-cart")) {
           
            const selectedProductId = element.parentNode.dataset.productId; // Would've been better to have this within the button
            const productData = products.find(element => element.id === selectedProductId)

            // addToCart(productData); // Change to product view
            populateSingleProduct(productData, products); 
            swapView("singleproduct");
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
        } else if (element.id === "clear-filter") {
            clearAllFilters(products);
        }
    });

    // Filter Menu Container Events
    const filterMenuContainer = document.querySelector("#filter") // change to div around the filter
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

    // Sort Selection Event
    const sortBySelection = document.querySelector("#sort-by");
    sortBySelection.addEventListener("change", (e)=>{
        const value = sortBySelection.value.split("-",2);
        const type = value[0];
        const order = value[1] === "asc"

        changeSort(products, type, order);
    });
}

function loadGenderView(products) {
    // Init Gender View
    initGenderView(products);

    // Gender Category Icon Event
    function onClickCategories(e) {
        const element = e.target

        if (element.dataset.category || element.parentNode.dataset.category) {
            const gender = element.dataset.gender ?? element.parentNode.dataset.gender;
            const category = element.dataset.category ?? element.parentNode.dataset.category;

            // apply filter
            clearAllFilters(products);
            addFilter(products, "gender", gender);
            addFilter(products, "category", category);

            // switch view
            swapView("browse");
        }
    }

    // Men Category Icon Events
    const mensCategories = document.querySelector("#mens-categories");
    mensCategories.addEventListener("click", onClickCategories);

    // Women Category Icon Events
    const womensCategories = document.querySelector("#womens-categories");
    womensCategories.addEventListener("click", onClickCategories);
}

function loadCart(products) {
    // Init Cart
    initCart(products);

    // Cart Events 
    // NOTE: Some cart events are within cart.js
    document.querySelector("#cart-product-container").addEventListener("click", (e)=>{
        const element = e.target;

        if (element.classList.contains("remove-from-cart")) {
            const parent = element.closest(".cart-product");
            removeFromCart(parent.dataset.productId, parent.dataset.size, parent.dataset.color, parent);
        }
    });
}

function loadAll(products) {
    loadGenderView(products);
    loadBrowse(products);
    loadCart(products);
}

function swapView(articleId) {
    const articles = document.querySelectorAll("main article");
    for (let article of articles) {
        if (article.id == articleId) {
            article.classList.remove("hidden");
        } else {
            article.classList.add("hidden");
        }
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    // Swap Events
    document.querySelector("#header-logo").addEventListener("click", ()=>{swapView("home")});
    document.querySelector("#nav-home").addEventListener("click", ()=>{swapView("home")});
    document.querySelector("#nav-women").addEventListener("click", ()=>{swapView("women")});
    document.querySelector("#nav-men").addEventListener("click", ()=>{swapView("men")});
    document.querySelector("#nav-browse").addEventListener("click", ()=>{swapView("browse")});
    document.querySelector("#nav-cart").addEventListener("click", ()=>{swapView("cart")});
    
    swapView("home");

    // About setup
    const dialog = document.querySelector("#about");
    document.querySelector("#nav-about").addEventListener("click", ()=>{dialog.showModal();});
    dialog.addEventListener("click", (e)=>{dialog.close();});

    const productData = localStorage.getItem("productData")
    
    if (!productData) {
        fetch("./data/data-minifed.json")
        .then(response=>{
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("fetch failed");
            }
        })
        .then(data=>{
            initGrouping(data);
            localStorage.setItem("productData", JSON.stringify(data));
            loadAll(data);
        })
        .catch(err=>{
            localStorage.clear();
            alert("An error has occurred, please try again later");
        });
                
    } else {
        initGrouping(JSON.parse(productData));
        loadAll(JSON.parse(productData));
    }
});



