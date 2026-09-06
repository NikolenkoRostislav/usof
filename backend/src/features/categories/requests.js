class CreateCategoryRequest {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }
}

class UpdateCategoryRequest {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }
}

module.exports = {
    CreateCategoryRequest,
    UpdateCategoryRequest,
};
