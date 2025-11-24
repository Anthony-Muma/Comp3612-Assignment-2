import { retrieve } from "../grouping.js";

// 
function createCategoryHtml(category, gender, amount) {
    const template = document.querySelector("#gender-category-template");
    const parent = document.querySelector(`#${gender}-categories`);
    const clone = template.content.cloneNode(true);
        
    const genderCategory = clone.querySelector(".gender-category");
    
    genderCategory.dataset.gender = gender;
    genderCategory.dataset.category = category;
    
    const categoryName = genderCategory.querySelector(".category-name");
    categoryName.textContent = `${category} (${amount})`;

    parent.appendChild(clone);
}


export function initGenderView(product) {
    // Male
    const maleCount = retrieve(["mens"]);

    const maleCategories = maleCount.category;

    for (let category in maleCategories) {
        createCategoryHtml(category, "mens", maleCategories[category]);
    }
    

    // Female
    const femaleCount = retrieve(["womens"]);

    const femaleCategories = femaleCount.category;

    for (let category in femaleCategories) {
        createCategoryHtml(category, "womens", femaleCategories[category]);
    }
}