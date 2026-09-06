class PostResponse {
    constructor(post) {
        this.id = post.id;
        this.title = post.title;
        this.content = post.content;
        this.authorId = post.authorId;
        this.status = post.status;
        this.categories = post.categories || [];
        this.publishDate = post.publishDate;
    }
}

class PostsListResponse {
    constructor(posts) {
        this.posts = posts.map(p => new PostResponse(p));
    }
}

module.exports = {
    PostResponse,
    PostsListResponse,
};
