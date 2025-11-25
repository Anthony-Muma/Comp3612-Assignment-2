import { retrieve } from "./grouping.js";

// DOM helper function -------------------------------------------------------------------------------

function createCategoryHtml(category, gender, amount) {
    const template = document.querySelector("#gender-category-template");
    const parent = document.querySelector(`#${gender}-categories`);
    const clone = template.content.cloneNode(true);
        
    const genderCategory = clone.querySelector(".gender-category");
    
    genderCategory.dataset.gender = gender;
    genderCategory.dataset.category = category;
    
    const categoryName = genderCategory.querySelector(".category-name");
    categoryName.textContent = `${category} (${amount})`;

    const img = clone.querySelector("img");
    img.src = `https://placehold.co/600x800?text=${encodeURIComponent(category)}`;
    img.alt = category;

    parent.appendChild(clone);
}

// Init -------------------------------------------------------------------------------

function initGenderCategories(gender) {
    // retrieve(gender, category, sizes, colorGroup)
    // [""] used to stop traversal beyond category in the grouping tree
    const available = retrieve([gender], [], [""], [""]);
    const categories = available.category;

    for (const category in categories) {
        createCategoryHtml(category, gender, categories[category]);
    }
}

export function initGenderView() {
    initGenderCategories("mens");
    initGenderCategories("womens");
}