const SET_RESOURCE_PAGINATION = 'SET_RESOURCE_PAGINATION'
const SET_USER_CURRENT_PAGE = 'SET_USER_CURRENT_PAGE'
const SET_USER_SELECTED_PAGE = 'SET_USER_SELECTED_PAGE'
const CLEAR_PAGINATION_DATA = 'CLEAR_PAGINATION_DATA'

// Essa store foi criada para ser global e que pode ser usada para paginar
// qualquer tipo de coleção. Exemplo: Products, ProducTypes, etc.

  export const state = () => ({
    namespaced: true,
    state: {
      currentPage: 1,
      totalPages: 0,
      maxPageItems: 0,
      totalCount: 0,
      firstLink: '',
      nextLink: '',
      lastLink: '',
      userSelectedPage: ''
    }
  })
  export default {
    showBrandsDialog: ({ commit }, headers) => {
      commit(SET_RESOURCE_PAGINATION, headers)
    },
    userSelectedPage: ({ commit }, pageNumber) => {
      commit(SET_USER_SELECTED_PAGE, pageNumber)
    },
    setCurrentPage: ({ commit }, pageNumber) => {
      commit(SET_USER_CURRENT_PAGE, pageNumber)
    },
    clearPagination: ({ commit }) => {
      commit(CLEAR_PAGINATION_DATA)
    },
  }
  export const mutations = {
    [SET_USER_CURRENT_PAGE]: (state, pageNumber) => {
      state.currentPage = pageNumber
    },

    [CLEAR_PAGINATION_DATA]: (state) => {
      state.currentPage = 1
      state.totalPages = 0
      state.maxPageItems = 0
      state.firstLink = ''
      state.nextLink = ''
      state.lastLink = ''
      state.userSelectedPage = ''
    },

    [SET_RESOURCE_PAGINATION]: (state, headers) => {
      if (headers['link']) {
        const links = headers['link'].split(',').map(link => link.match(/<(.+)>/)[1])

        let [firstLink, nextLink, lastLink] = links

        state.currentPage = parseInt(headers['current-page'])
        state.totalPages = parseInt(headers['total-pages'])
        state.maxPageItems = parseInt(headers['page-items'])
        state.totalCount = parseInt(headers['total-count'])
        state.firstLink = firstLink,
        state.nextLink = nextLink,
        state.lastLink = lastLink
      }
    },

    [SET_USER_SELECTED_PAGE]: (state, pageNumber) => {
      if (state.firstLink) {
        // Separa a url que vem no cabeçalho da app Rails feita pelo Pagy
        // Esse regex serve para capturar apenas as urls com os parâmetros
        // enviados, sem o número da página no final. Isso será utilizado para
        // compor a url que o usuário clicar no item de paginação e exibir para
        // ele.
        let resourceUrl = state.firstLink.split(/=[0-9]+$/)[0]

        state.userSelectedPage = `${resourceUrl}=${pageNumber}`
      }
    },
  }

