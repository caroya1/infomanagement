// src/mock/favoriteData.js
const favorites = [];

const favoriteApi = {
  addFavorite: (post) => {
    favorites.push(post);
  },
  removeFavorite: (postId) => {
    const index = favorites.findIndex(post => post.id === postId);
    if (index !== -1) {
      favorites.splice(index, 1);
    }
  },
  isFavorite: (postId) => {
    return favorites.some(post => post.id === postId);
  },
  getFavorites: () => {
    return favorites;
  }
};

export { favoriteApi };