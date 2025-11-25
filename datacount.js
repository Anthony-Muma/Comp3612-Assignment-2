export const totalGroupingCount = {
    gender : {},
    category : {},
    size : {},
    colorGroup : {} 
}

export const genderCategoryGroupingCount = {
    mens : {},
    womens : {}
}

export function initGroupingCount(products) {
    for (let product of products) {
        totalGroupingCount.gender[product.gender] = totalGroupingCount.gender[product.gender] ? totalGroupingCount.gender[product.gender] + 1 : 1;
        totalGroupingCount.category[product.category] = totalGroupingCount.category[product.category] ? totalGroupingCount.category[product.category] + 1 : 1;

        for (let size of product.sizes) {
            totalGroupingCount.size[size] = totalGroupingCount.size[size] ? totalGroupingCount.size[size] + 1 : 1;
        }
    }
}