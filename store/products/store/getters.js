export default {
  chuncked: state => {
    const PRODUCTS_PER_FAMILY_CARD = 5;
    let totalChunks = [];
    let products = state.products;

    for (var i = 0; i < products.length; i += PRODUCTS_PER_FAMILY_CARD) {
      totalChunks.push(products.slice(i, i + PRODUCTS_PER_FAMILY_CARD));
    }
    return totalChunks;
  }
}
