import * as types from './mutations-types';
import viaCep from "@/api/viaCep";
import SearchRegionService from "@/services/searchRegion";
// import router from '@/router'

export default {
  setCep: ({ commit, dispatch }, cep) => {
    commit(types.SET_CEP, cep);

    localStorage.cep = cep

    dispatch("setCity", cep);
  },

  setCity: async ({ commit, dispatch }, cep) => {
    let response = await viaCep.searchByZipcode(cep);
    if(response.data.erro)
      commit(types.SET_CITY, 'erro');
    else {
      let city = response.data.localidade;

      commit(types.SET_CITY, city);
      dispatch("setRegion");
    }
  },

  clearCity: async ({ commit, dispatch }) => {
    commit(types.SET_CITY, null);
  },

  setRegion: async ({ commit, state, dispatch }) => {
    let city = state.city;
    let response = await SearchRegionService.create(city);
    let region = response.data;

    commit(types.SET_REGION, region);

    localStorage.region_id = region.id
    localStorage.uf = region.uf

    dispatch("products/getProducts", null, { root: true });
    dispatch("setProductTypes");
    dispatch("setFamilyProducts");
  },

  setAllowed({ commit }, value) {
    localStorage.allowed = value
    commit(types.SET_ALLOWED, value);
  },

  setProductsAfterLogout: ({dispatch}) => {
    dispatch("products/getProducts", null, { root: true });
  },

  setProductTypes: ({ dispatch }) => {
    let currentRoute = router.currentRoute;

    if (currentRoute.name === "product-type") {
      let filterOptions = {
        productTypeId: currentRoute.params.productTypeId
      }

      dispatch("productTypes/getProducts", filterOptions, { root: true });
    }
  },

  setFamilyProducts: ({ dispatch }) => {
    let currentRoute = router.currentRoute;

    if (currentRoute.name === "family") {

      let familyId = currentRoute.params.familyId

      dispatch("families/getProducts", familyId, { root: true });
    }
  },

  setSupplierServes: ({ commit, state }, supplierServes) => {
    if (state.supplierServes !== supplierServes) {
      localStorage.serves_type = supplierServes
      commit(types.SET_SUPPLIER_SERVES, supplierServes);
    }
  },

  clearFilterParams: ({ commit, state }, region) => {
    localStorage.serves_type = null
    localStorage.region_id = null

    if(region && region.id)
      localStorage.uf = region.id
    else
      localStorage.uf = null

    commit(types.SET_SUPPLIER_SERVES, null)
    commit(types.SET_REGION,  { id: null, name: null, uf: null })
  },
}
