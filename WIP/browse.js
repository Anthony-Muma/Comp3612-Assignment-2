import { retrieve } from "../grouping.js";


const activeFilters = {
    // TODO: replace array to dict for faster lookup
    gender : [],
    category : [],
    sizes : [],
    colorGroup : []
}

const nameSort = function(a,b) {
    const titleA = a.name
    const titleB = b.name
    if (titleA > titleB) return 1
    else if (titleA < titleB) return -1
    else return 0
}

const priceSort = function(a,b) {
    const priceA = a.price;
    const priceB = b.price;
    return priceB - priceA;
}

// DOM -------------------------------------------------------------------------------
function createFilterOptionHtml(key, value) {
    const template = document.querySelector(`#filter-option-template`);
    const parent = document.querySelector(`#${key}-filter`);
    const clone = template.content.cloneNode(true);

    const button = clone.querySelector("button");
    button.dataset.key = key
    button.dataset.value = value;
    button.textContent = `${value}`;

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
    const tagButton = document.querySelector(`#current-filters [data-key='${key}'][data-value='${value}']`)
    if (tagButton) {
        tagButton.remove();
    }
}

function toggleFilterOptionHtml(key, value) {
    const button = document.querySelector(`.filter .filter-button[data-key="${key}"][data-value="${value}"]`);
    if (button.classList.contains("active")) {
        button.classList.remove("active");
    } else {
        button.classList.add("active");
    }
}

function hideUnrelatedFilterOptionHtml(key, value) {
    const button = document.querySelector(`.filter .filter-button[data-key="${key}"][data-value="${value}"]`);
}

function unhideUnrelatedFilterOptionHtml(key, value) {
    
}

function matchFilters(product) {
    // V2, original was very messy and I didn't know .includes/.some existed, thanks JS
    const { gender, category, sizes, colorGroup} = activeFilters;

    const genderBool = gender.length === 0 || gender.includes(product.gender);
    const categoryBool = category.length === 0 || category.includes(product.category);
    const sizeBool = sizes.length === 0 || sizes.some(size=>product.sizes.includes(size));
    const colorBool = colorGroup.length === 0 || colorGroup.some(color=>product.colorGroup.includes(color));

    // additive (AND's)
    return genderBool && categoryBool && sizeBool && colorBool;
}
// LOGIC -------------------------------------------------------------------------------
function getFilteredProducts(products) {
    return products.filter(product=>matchFilters(product));
    // TODO: CLEAN
    // return products.filter(product => {
    //     for (let filter in activeFilters) {
    //         for (let f of activeFilters[filter]) {
    //             if (Array.isArray(product[filter])) {
    //                 if (!product[filter].find(e=>e == f)) {
    //                     return false
    //                 }
    //             }
    //             else if (product[filter] != f) {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // });
}


export function changeSort(products, sortBy="name", orderBy="desc") {
    let sortFn;
    if (sortBy == "name") {
        sortFn = nameSort;
    } else if (sortBy == "price") {
        sortFn = priceSort;
    }

    products.sort(sortFn);
    renderBrowse(products);
}

// MAIN -------------------------------------------------------------------------------
function renderBrowse(products) {
    const productTemplate = document.querySelector("#browse-product-template");
    const parent = document.querySelector("#filtered-product-container");
    parent.innerHTML = '';
    
    for (let product of products) {
        const clone = productTemplate.content.cloneNode(true);
        
        const browseProduct = clone.querySelector(".browse-product")
        const title = clone.querySelector(".title");
        const price = clone.querySelector(".price");
        const sizes = clone.querySelector(".sizes span");
        const colors = clone.querySelector(".colors span")

        browseProduct.dataset.productId = `${product.id}`;
        title.textContent = `${product.name} + ${product.gender} + ${product.category}`;
        price.textContent = `${product.price}`;

        sizes.textContent = `${product.sizes}`;
        colors.classList.add(`bg-[${product.color[0].hex}]`);

        parent.appendChild(clone);
    }
}


// PUBLIC -------------------------------------------------------------------------------

// i.e "color" "black", "gender" "male", etc
export function addFilter(products, key, value) {
    
    //Add filter to others
    activeFilters[key].push(value);
    const { gender, category, sizes, colorGroup} = activeFilters;

    //Update filter HTML
    createFilterTagHtml(key, value);
    toggleFilterOptionHtml(key, value);
    updateFilterOptionsHtml();
    // TODO: ...hide unrelated filters

    // Filter the products
    
    const filteredProducts = getFilteredProducts(products);
    console.log(filteredProducts)
    renderBrowse(filteredProducts);
}

export function removeFilter(products, key, value) {
    //Remove filter to others
    activeFilters[key] = activeFilters[key].filter(f=>f!=value);
    const { gender, category, sizes, colorGroup} = activeFilters;

    //Update HTML
    removeFilterTagHtml(key, value);
    toggleFilterOptionHtml(key, value);
    updateFilterOptionsHtml();
    // TODO: ...Unhide unrelated filters

    // Filter the products
    const filteredProducts = getFilteredProducts(products);
    renderBrowse(filteredProducts);
}

export function clearAllFilters(products) {

    // Update HTML

    // Tags
    document.querySelector("#current-filters").innerHTML = ""; 

    // List
    for (let key in activeFilters) {
        const buttons = document.querySelectorAll(`.filter .filter-button[data-key][data-value]`);
        for (let button of buttons) {
            button.classList.remove("active");
        }

        // Clear filter
        activeFilters[key] = []
    };

    updateFilterOptionsHtml();

    // Display All products
    renderBrowse(products);
}

export function initBrowse(products) {
    // Init Filters
    const available = retrieve();

    for (let category in available.category) {
       createFilterOptionHtml("category", category) 
    }
    for (let size in available.size) {
       createFilterOptionHtml("sizes", size) 
    }
    for (let color in available.colorGroup) {
       createFilterOptionHtml("colorGroup", color) 
    }

    updateFilterOptionsHtml();


    changeSort(products, "price");
}

function updateFilterOptionsHtml() {
    const { gender, category, sizes, colorGroup} = activeFilters;
    let available = retrieve(gender);

    //
    const categoryFilterOptions = document.querySelectorAll(`#category-filter .filter-button[data-key="category"][data-value]`);
    for (let categoryFilterOption of categoryFilterOptions) {
        categoryFilterOption.classList.add("hidden");
    }

    for (let category in available.category) {
        console.log(category);
        const categoryFilterOption = document.querySelector(`#category-filter .filter-button[data-key="category"][data-value="${category}"]`);
        categoryFilterOption.classList.remove("hidden");
    }


    // Only display where there is a category
    const sizeFilterOptions = document.querySelectorAll(`#sizes-filter .filter-button[data-key="sizes"][data-value]`);
    for (let sizeFilterOption of sizeFilterOptions) {
        sizeFilterOption.classList.add("hidden");
    }

    const colorFilterOptions = document.querySelectorAll(`#colorGroup-filter .filter-button[data-key="colorGroup"][data-value]`);
    for (let colorFilterOption of colorFilterOptions) {
        colorFilterOption.classList.add("hidden");
    }


    available = retrieve(gender, category);
    console.log(available);
    if (category.length !== 0) {
        for (let size in available.size) {
            const sizeFilterOption = document.querySelector(`#sizes-filter .filter-button[data-key="sizes"][data-value="${size}"]`);
            sizeFilterOption.classList.remove("hidden");
        }
        for (let color in available.colorGroup) {
            const colorFilterOption = document.querySelector(`#colorGroup-filter .filter-button[data-key="colorGroup"][data-value="${color}"]`);
            colorFilterOption.classList.remove("hidden");
        }
    }


}