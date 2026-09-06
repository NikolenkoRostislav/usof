class CreatePostRequest {
    constructor(title, content, categories) {
        this.title = title;
        this.content = content;
        this.categories = categories;
    }
}

class UpdatePostRequest {
    constructor(status, title, content, categories) {
        this.status = status;
        this.title = title;
        this.content = content;
        this.categories = categories;
    }
}

module.exports = {
    CreatePostRequest,
    UpdatePostRequest,
};
