class FavoriteResponse {
    constructor(favorite) {
        this.userId = favorite.userId;
        this.postId = favorite.postId;
    }
}

class FavoritesListResponse {
    constructor(favorites) {
        this.favorites = favorites.map(f => new FavoriteResponse(f));
    }
}

module.exports = {
    FavoriteResponse,
    FavoritesListResponse,
};
