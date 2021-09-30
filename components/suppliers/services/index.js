import Vue from 'vue'
import qs from 'qs'

const RESOURCE_URL = '/api/v1/users/suppliers'

export default {
  get() {
    return Vue.axios.get(`${RESOURCE_URL}/info`)
  },
  getAllAuto(product) {
    return Vue.axios.get(`${RESOURCE_URL}/show_all_auto`, {
      params: { product },
      paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: "brackets",
          encode: false
        })
      }
    })
  },
  getAll(){
    return Vue.axios.get(`${RESOURCE_URL}/show_all`)
  },

  getById(id) {
    return Vue.axios.get(`${RESOURCE_URL}/${id}`)
  },

  getBySlug(slug) {
    return Vue.axios.get(`${RESOURCE_URL}/${slug}/slug`)
  },

  getStates() {
    return Vue.axios.get(`${RESOURCE_URL}/states/`)
  },

  getTotalSuppliers() {
    return Vue.axios.get(`${RESOURCE_URL}/count/valid_suppliers`)
  },

  getQuotations() {
    return Vue.axios.get(`${RESOURCE_URL}/quotations`)
  },

  getExpeditionsByQuotation(quotationId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_product_expeditions/${quotationId}`)
  },

  getExpeditionsByQuotationAndPage(quotationId, page) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_product_expeditions/${quotationId}?page=${page}`)
  },

  getExpeditionsByProductType(productTypeId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_product_expeditions/by_product_type/${productTypeId}`)
  },

  getExpeditionsByProductTypeAndSupplier(productTypeId, supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_product_expeditions/by_product_type_and_supplier/${productTypeId}/${supplierId}`)
  },

  getOfferExpeditionsBySupplier(supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_product_expeditions/offers_by_supplier/${supplierId}`)
  },

  getExpeditionsByFamilyAndSupplier(family, supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_product_expeditions/by_family_and_supplier/${family}/${supplierId}`)
  },

  getOfferProductsBySupplier(supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/offers_by_supplier/${supplierId}`)
  },

  getCatalogByProductType(productTypeId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/by_product_type/${productTypeId}`)
  },

  getCatalogByProductTypeAndSupplier(productTypeId, supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/by_product_type_and_supplier/${productTypeId}/${supplierId}`)
  },
  getRandomSaleProducts() {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/random_sale_products`)
  },
  getAllSaleProducts() {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/all_sale_products`)
  },
  getSaleProducts() {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/sale_products`)
  },
  getSaleProductsBySupplier(supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/sale_products/${supplierId}`)
  },

  getSaleSupplierExpeditions() {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_product_expeditions/supplier/sale_expeditions`)
  },

  getCatalogByFamilyAndSupplier(family, supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/by_family_and_supplier/${family}/${supplierId}`)
  },

  getCatalogByCollectionAndSupplier(family, collection, supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/by_collection_and_supplier/${family}/${collection}/${supplierId}`)
  },

  getCatalogByCategoryAndSupplier(family, category, supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/by_category_and_supplier/${family}/${category}/${supplierId}`)
  },

  getAllProductsByCategoryAndSupplier(family, category, supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/all_products_by_category_and_supplier/${family}/${category}/${supplierId}`)
  },

  getSampleCatalogByProductTypeAndSupplier(productTypeId, supplierId) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/samples_by_product_type_and_supplier/${productTypeId}/${supplierId}`)
  },

  getCatalog() {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products`)
  },

  getCatalogById(id) {
    return Vue.axios.get(`${RESOURCE_URL}/supplier_products/by_id/${id}`)
  },

  getNoPriceData() {
    return Vue.axios.get(`${RESOURCE_URL}/product_types/no_price`)
  },

  updateDeliveryRate(rate) {
    return Vue.axios.post(`${RESOURCE_URL}/delivery_rate`, rate)
  },

  checkSupplierStoreParams(uf, city, userType, id) {
    return Vue.axios.get(`${RESOURCE_URL}/${id}/store_available/${uf}/${city}/${userType}`)
  },

  storeSearchProducts(keyword, supplierId, category, page) {
    return Vue.axios.get(`/api/v1/users/suppliers/${supplierId}/search_products/${keyword}?category_id=${category}&page=${page}`)
  },

  getExpeditionsBySearchAndSupplier(keyword, supplierId, page) {
    return Vue.axios.get(`/api/v1/users/suppliers/${supplierId}/search_expeditions/${keyword}?page=${page}`)
  },

  searchAutomaticCatalog(keyword) {
    return Vue.axios.post(`/api/v1/users/suppliers/search_automatic_catalog`, { keyword: keyword })
  },

  canUserAccessStore(supplierId) {
    return Vue.axios.get(`/api/v1/users/suppliers/can_user_access_store/${supplierId}`)
  },
}
