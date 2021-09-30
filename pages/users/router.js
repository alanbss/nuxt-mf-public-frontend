import store from '@/store/'
import { checkUserStatus } from "@/mixins/statusChecker"
import Vue from 'vue'

const routes = [

  {
    path: '/painel-de-cotacoes/:quoteId',
    name: 'users.quotePanel',
    component: () =>
      import('@/resources/users/views/QuotePanel.vue'),
    meta: {
      auth: true,
      leaveQuotationButton: true,
      blockSearch: true,
      hideNavbar: true,
      backUrl: '/minhas-cotacoes'
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: '/ver-pedido/:quotationId',
    name: 'users.checkOrder',
    component: () =>
      import('@/resources/users/views/CheckOrder.vue'),
    meta: {
      auth: true,
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: '/revisar-pedido/:quotationId',
    name: 'users.reviewQuotation',
    component: () =>
      import('@/resources/users/views/ReviewQuotation.vue'),
    meta: {
      auth: true,
      leaveQuotationButton: true,
      backUrl: '/painel-de-cotacoes',
      blockSearch: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: '/revisar-pedido/produtos/:quotationId',
    name: 'users.reviewQuotationProducts',
    component: () =>
      import('@/resources/users/views/ReviewQuotationProducts.vue'),
    meta: {
      auth: true,
      blockSearch: true,
      reviewingOrder: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },

  {
    path: '/loja/busca/:supplierSlug/:keyword',
    name: 'public-store-search',
    component: () =>
      import('@/resources/users/views/StoreSearch.vue'),
    meta: {
      publicPage: true,
      supplierStore: true,
      photoNavbar: true
    },
  },
  {
    path: '/loja/:supplierSlug',
    name: 'public-store',
    component: () =>
      import('@/resources/users/views/SupplierPublicPage.vue'),
    meta: {
      publicPage: true,
      supplierStore: true,
      photoNavbar: true
    }
  },
  {
    path: '/loja/:supplierSlug/revisar-compra/:orderId',
    name: 'users.reviewOrder',
    component: () =>
      import('@/resources/users/views/ReviewOrder.vue'),
    meta: {
      blockSearch: true,
      publicPage: true,
      supplierStore: true,
      leaveQuotationButton: true,
      backUrl: '',
    },
  },
  {
    path: '/loja/:supplierSlug/revisar-compra/produtos/:orderId',
    name: 'users.reviewOrderProducts',
    component: () =>
      import('@/resources/users/views/ReviewOrderProducts.vue'),
    meta: {
      blockSearch: true,
      publicPage: true,
      supplierStore: true
    },
  },
  {
    path: '/loja/:supplierSlug/:familyName',
    name: 'public-store-family',
    component: () =>
      import('@/resources/users/views/SupplierPublicPage.vue'),
    meta: {
      publicPage: true,
      supplierStore: true,
      familyView: true,
    },
  },
  {
    path: '/loja/:supplierSlug/:familyName/:categoryName',
    name: 'public-store-category',
    component: () =>
      import('@/resources/users/views/SupplierPublicPage.vue'),
    meta: {
      publicPage: true,
      supplierStore: true,
      categoryView: true,
    },
  },
  {
    path: '/loja/:supplierSlug/:familyName/:categoryName/:productTypeName',
    name: 'public-store-product',
    component: () =>
      import('@/resources/users/views/SupplierPublicPage.vue'),
    meta: {
      publicPage: true,
      supplierStore: true,
      productTypeView: true,
    },
  },

  {
    path: '/conta-suspensa',
    name: 'users.suspended',
    component: () =>
      import('@/resources/users/views/Suspended.vue'),
    meta: {
      auth: true,
      suspended: true
    }
  },





]

export default routes
