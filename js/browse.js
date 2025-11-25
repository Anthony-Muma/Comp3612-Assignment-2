// import { totalGroupingCount } from "../datacount.js";
import { retrieve } from "./grouping.js";
import { colorGroupMap } from "./grouping.js";

// An object representing all current filters
const activeFilters = {
    gender : [],
    category : [],
    sizes : [],
    colorGroup : []
};

// USES: for A) showing counts for filters B) hiding irrelevant categories, sizes and color.
// **OLD: Instead, I use the custom tree structure. A) Nice leveled filtering B) Nice interface. (retrieve w/ activeFilters) More info within grouping.js
// **NOTE: I just commented out the old stuff, not deleted (Just in case)

// let groupingCounter = {
//     gender : {},
//     category : {},
//     size : {},
//     colorGroup : {} 
// }

// Sorting functions -------------------------------------------------------------------------------

const nameSortASC = (a,b) => {
    const titleA = a.name;
    const titleB = b.name;
    if (titleA > titleB) return 1;
    else if (titleA < titleB) return -1;
    else return 0;
};

const nameSortDESC = (a,b) => {
    const titleA = a.name;
    const titleB = b.name;
    if (titleA > titleB) return -1;
    else if (titleA < titleB) return 1;
    else return 0;
}

const categorySortASC = (a,b) => {
    const titleA = a.category;
    const titleB = b.category;
    if (titleA > titleB) return 1;
    else if (titleA < titleB) return -1;
    else return 0;
}

const categorySortDESC = (a,b) => {
    const titleA = a.category;
    const titleB = b.category;
    if (titleA > titleB) return -1;
    else if (titleA < titleB) return 1;
    else return 0;
}

const priceSortDESC = (a,b) => {
    const priceA = a.price;
    const priceB = b.price;
    return priceB - priceA;
}

const priceSortASC = (a,b) => {
    const priceA = a.price;
    const priceB = b.price;
    return priceA - priceB;
}

export function changeSort(products, sortBy="name", asc=true) {
    let sortFn;
    if (sortBy === "name") {
        sortFn = asc ? nameSortASC : nameSortDESC;
    } else if (sortBy === "price") {
        sortFn = asc ? priceSortASC : priceSortDESC;
    } else if (sortBy === "category") {
        sortFn = asc ? categorySortASC : categorySortDESC;
    }

    const sorted = products.sort(sortFn)
    renderProductHtml(getFilteredProducts(sorted));
}


// Filtering functions -------------------------------------------------------------------------------

function matchFilters(product) {
    // V2, original was very messy
    const {gender, category, sizes, colorGroup} = activeFilters;

    const genderBool = gender.length === 0 || gender.includes(product.gender);
    const categoryBool = category.length === 0 || category.includes(product.category);
    const sizeBool = sizes.length === 0 || sizes.some(size=>product.sizes.includes(size));
    const colorBool = colorGroup.length === 0 || colorGroup.some(color=>product.color.find(pc=>pc.name === color));

    // additive (AND's)
    const check = genderBool && categoryBool && sizeBool && colorBool;

    
    // if (check) { // **OLD
    //     groupingCounter.gender[product.gender] = groupingCounter.gender[product.gender] ? groupingCounter.gender[product.gender] + 1 : 1;
    //     groupingCounter.category[product.category] = groupingCounter.category[product.category] ? groupingCounter.category[product.category] + 1 : 1;
    //     for (let size of product.sizes) {
    //         groupingCounter.size[size] = groupingCounter.size[size] ? groupingCounter.size[size] + 1 : 1;
    //     }
    //     // Add color
    // }

    return check;
}

function getFilteredProducts(products) {
    // groupingCounter = { // **OLD
    //     gender : {},
    //     category : {},
    //     size : {},
    //     colorGroup : {} 
    // }

    return products.filter(product=>matchFilters(product));
}

// i.e "color" "black", "gender" "male", etc
export function addFilter(products, key, value) {
    
    // Add & Apply Filter
    activeFilters[key].push(value);
    const filteredProducts = getFilteredProducts(products);

    // Update Filter HTML
    createFilterTagHtml(key, value);
    toggleFilterOptionHtml(key, value);
    updateFilterOptionsDisplayedHtml();

    // Render Filtered Products
    renderProductHtml(filteredProducts);
}

export function removeFilter(products, key, value) {

    // Remove & Apply filter
    activeFilters[key] = activeFilters[key].filter(f=>f!==value);
    const filteredProducts = getFilteredProducts(products);

    // Update filtered HTML
    removeFilterTagHtml(key, value);
    toggleFilterOptionHtml(key, value);
    updateFilterOptionsDisplayedHtml();

    // Render filtered products
    renderProductHtml(filteredProducts);
}

export function clearAllFilters(products) {
    
    
    // groupingCounter = totalGroupingCount; // **OLD

    // Clear current tags
    document.querySelector("#current-filters").innerHTML = ""; 

    // Menus options
    for (let key in activeFilters) {
        const buttons = document.querySelectorAll(`.filter .filter-button[data-key][data-value]`);
        for (let button of buttons) {
            button.classList.remove("active");
        }

        // Clear filter
        activeFilters[key] = [];
    };

    updateFilterOptionsDisplayedHtml();

    // Display all products
    renderProductHtml(products);
}

// DOM helper functions -------------------------------------------------------------------------------

function createFilterOptionHtml(key, value, color=null) {
    const template = document.querySelector(`#filter-option-template`);
    const parent = document.querySelector(`#${key}-filter`);
    const clone = template.content.cloneNode(true);

    const button = clone.querySelector("button");
    button.dataset.key = key;
    button.dataset.value = value;
    button.textContent = `${value}`;

    // If it happens to be a color based option
    if (color) {
        button.style.backgroundColor = color;
        button.style.color = "#FFFFFF";
        button.style.textShadow = "0 0 3px #000000, 0 0 5px #000000";

    }

    parent.appendChild(clone);
}

function createFilterTagHtml(key, value) {
    const template = document.querySelector("#filter-template");
    const parent = document.querySelector("#current-filters");
    const clone = template.content.cloneNode(true);
        
    const button = clone.querySelector("button");
    
    button.dataset.key = key;
    button.dataset.value = value;
    button.textContent = `${value}`;

    parent.appendChild(clone);
}

function removeFilterTagHtml(key, value) {
    const tagButton = document.querySelector(`#current-filters [data-key='${key}'][data-value='${value}']`);
    if (tagButton) {
        tagButton.remove();
    }
}

function toggleFilterOptionHtml(key, value) {
    const button = document.querySelector(`.filter .filter-button[data-key="${key}"][data-value="${value}"]`);
    button.classList.toggle("active");
}

function renderProductHtml(products) {
    const template = document.querySelector("#browse-product-template");
    const parent = document.querySelector("#filtered-product-container");
    parent.innerHTML = "";
    
    for (let product of products) {
        const clone = template.content.cloneNode(true);
        
        const browseProduct = clone.querySelector(".browse-product");
        const title = clone.querySelector(".title");
        const price = clone.querySelector(".price");
        const sizes = clone.querySelector(".sizes span");
        const colors = clone.querySelector(".colors span");
        const img = clone.querySelector("img");

        browseProduct.dataset.productId = `${product.id}`;
        title.textContent = `${product.name}`;
        price.textContent = `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}`;
        sizes.textContent = product.sizes.join(", ");
        if (img) {
            img.src = `https://placehold.co/600x800?text=${encodeURIComponent(product.name)}`;
            img.alt = product.name;
        }

        colors.style.backgroundColor = product.color[0].hex;
        // colors.classList.add(`bg-[${product.color[0].hex}]`);

        parent.appendChild(clone);
    }

    const resultCount = document.querySelector("#result-number span");
    resultCount.textContent = products.length;

    const noResultMessage = document.querySelector("#no-result-message");
    if (products.length === 0) {
        noResultMessage.classList.remove("hidden");
    } else {
        noResultMessage.classList.add("hidden");
    }
}

// Basically hides irrelevant filters
function updateFilterOptionsDisplayedHtml() {
    const { gender, category, sizes, colorGroup} = activeFilters;
    let available = retrieve(gender);

    const categoryFilterOptions = document.querySelectorAll(`#category-filter .filter-button[data-key="category"][data-value]`);
    for (let categoryFilterOption of categoryFilterOptions) {
        categoryFilterOption.classList.add("hidden");
    }

    for (let category in available.category) {
        const categoryFilterOption = document.querySelector(`#category-filter .filter-button[data-key="category"][data-value="${category}"]`);
        categoryFilterOption.classList.remove("hidden");
    }
    
    const sizeFilterOptions = document.querySelectorAll(`#sizes-filter .filter-button[data-key="sizes"][data-value]`);
    for (let sizeFilterOption of sizeFilterOptions) {
        sizeFilterOption.classList.add("hidden");
    }

    const colorFilterOptions = document.querySelectorAll(`#colorGroup-filter .filter-button[data-key="colorGroup"][data-value]`);
    for (let colorFilterOption of colorFilterOptions) {
        colorFilterOption.classList.add("hidden");
    }

    available = retrieve(gender, category);

    // Only display when there is a category filter active
    if (category.length !== 0) {
        for (let size in available.size) {
            const sizeFilterOption = document.querySelector(`#sizes-filter .filter-button[data-key="sizes"][data-value="${size}"]`);
            sizeFilterOption.classList.remove("hidden");
        }
    }

    for (let color in available.colorGroup) {
        const colorFilterOption = document.querySelector(`#colorGroup-filter .filter-button[data-key="colorGroup"][data-value="${color}"]`);
        colorFilterOption.classList.remove("hidden");
    }
}

// Init -------------------------------------------------------------------------------

export function initBrowse(products) {
    // groupingCounter = totalGroupingCount; // **OLD
    
    // Init Filters
    const available = retrieve();
    for (let category in available.category) {
       createFilterOptionHtml("category", category) 
    }
    for (let size in available.size) {
       createFilterOptionHtml("sizes", size) 
    }
    for (let color in available.colorGroup) {
       createFilterOptionHtml("colorGroup", color, colorGroupMap.get(color)) 
    }

    updateFilterOptionsDisplayedHtml();

    changeSort(products, "name", true);
}

export function loadProductHandlers(products, selector) {
    const container = document.querySelector(selector);

    // Add listener for the "Related Products" section
    container.addEventListener("click", (e) => {
        const target = e.target;

        // 1. Find the card
        const productCard = target.closest(".browse-product");
        if (!productCard) return;

        const selectedProductId = productCard.dataset.productId;
        const productData = products.find(p => p.id === selectedProductId);

        if (!productData) return;

        //  Add to Cart Click
        if (target.closest(".add-to-cart")) {
            const defaultColor = productData.color[0].hex;
            const defaultSize = productData.sizes[0];

            addToCart(productData, 1, defaultColor, defaultSize);
            showToast(`Added ${productData.name} to bag`);
        } 
        //  Navigation Click (Load new product)
        else {
            populateSingleProduct(productData, products);
            window.scrollTo(0, 0);
        }
    });
}