class CategoryResponse {
    constructor(category) {
        this.id = category.id;
        this.title = category.title;
        this.description = category.description;
    }
}

class CategoriesListResponse {
    constructor(categories) {
        this.categories = categories.map(c => new CategoryResponse(c));
    }
}

module.exports = {
    CategoryResponse,
    CategoriesListResponse,
};
