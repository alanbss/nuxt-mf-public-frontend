export default {
  categoriesWithCollection: (state) => state.family.withCollection,
  categoriesWithoutCollection: (state) => state.family.withoutCollection,

  familiesWithChunckedProducts: (state, getters, rootState, rootGetters) => {
    let chunckedProducts = rootGetters['products/chuncked']

    if (chunckedProducts.length) {
      return state.families.map((f, index) =>
        Object.assign(f, { chunkedProducts: chunckedProducts[index] })
      );
    }
    else {
      return state.families.map((f) =>
        Object.assign(f, { chunkedProducts: [] })
      );
    }
  },

  chunckedProductsArray: (state) => {
    const PRODUCTS_PER_FAMILY_CARD = 5;
    let totalChunks = [];

    for (var i = 0; i < state.products.length; i += PRODUCTS_PER_FAMILY_CARD) {
      totalChunks.push(state.products.slice(i, i + PRODUCTS_PER_FAMILY_CARD));
    }

    return totalChunks;
  },

  chunckedProductsFromFamily: (state, getters) => {
    let array = getters.chunckedProductsArray;
    let products = state.products.map((f, index) =>
      Object.assign(f, { chunkedProducts: array[index] })
    );

    return products;
  }
}
