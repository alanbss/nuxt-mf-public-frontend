import Vue from 'vue'

// Isso é um serviço global para ser reutilizado nas stores dos resources que
// forem implementadas paginação.
export default {
  getResourceByPageNumber(resourceUrl) {
    return Vue.axios.get(resourceUrl)
  }
}