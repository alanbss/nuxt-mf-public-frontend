import { checkUserStatus } from "@/mixins/statusChecker"
import store from '@/store/'
import Vue from 'vue'

const routes = [
  {
    path: "/condicoes-de-atendimento",
    name: "service-conditions",
    component: () => import("@/resources/suppliers/views/ServiceConditions.vue"),
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: "/tipos-de-cliente",
    name: "client-types",
    component: () => import("@/resources/suppliers/views/ClientTypes.vue"),
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: "/valor-minimo-de-pedido",
    name: "minimum-order-value",
    component: () => import("@/resources/suppliers/views/MinimumOrderValue.vue"),
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: "/prazo-de-entrega",
    name: "delivery-conditions",
    component: () => import("@/resources/suppliers/views/DeliveryConditions.vue"),
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: "/area-de-atendimento",
    name: "delivery-areas",
    component: () => import("@/resources/suppliers/views/DeliveryAreas.vue"),
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: "/tipos-de-pagamento",
    name: "payment-methods",
    component: () => import("@/resources/suppliers/views/PaymentMethods.vue"),
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: "/cotacoes",
    name: "quotation-panel",
    component: () => import("@/resources/suppliers/views/QuotationPanel.vue"),
    meta: {
      auth: true,
      hideFooter: true,
      logoRefresh: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
      const userLoggedIn = Vue.auth.check()
      if (userLoggedIn) {
        if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Precificação') {
          next('/precificar')
        } else if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Não liberado') {
          next('/condicoes-de-atendimento')
        } else if (!Vue.auth.user().isSupplier) {
          next('/')
        }
      }
    }
  },
  {
    path: "/responder-cotacao/:quotationId",
    name: "reply-quotation",
    component: () => import("@/resources/suppliers/views/ReplyQuotationInfo.vue"),
    meta: {
      auth: true,
      hideFooter: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
    }
  },
  {
    path: "/incluir-produtos",
    name: "products-empty",
    component: () => import("@/resources/suppliers/views/ProductsEmpty.vue"),
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
      const userLoggedIn = Vue.auth.check()
      if (userLoggedIn) {
        if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Precificação') {
          next('/precificar')
        } else if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Liberado') {
          next('/cotacoes')
        }
      }
    },
  },
  {
    path: "/meu-catalogo",
    name: "my-catalog",
    component: () => import("@/resources/suppliers/views/Catalog.vue"),
    meta: {
      auth: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
      if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Não liberado') {
        next('/condicoes-de-atendimento')
      }
    }
  },
  {
    path: "/precificar",
    name: "pricing",
    component: () => import("@/resources/suppliers/views/Pricing.vue"),
    meta: {
      auth: true,
      pricing: true,
      hideFooter: true
    },
    beforeEnter: (to, from, next) => {
      checkUserStatus(to, from, next, store)
      if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Não liberado') {
        next('/condicoes-de-atendimento')
      } else if (Vue.auth.user().isSupplier && !Vue.auth.user().isAutomatic) {
        next('/')
      } else if (!Vue.auth.user().isSupplier) {
        next('/')
      }
    }
  },
  {
    path: '/pedido/:quotationId',
    name: 'supplier-order',
    component: () =>
      import('@/resources/suppliers/views/CheckOrder.vue'),
    meta: {
      hideFooter: true
    },

  },
  {
    path: '/compra/:orderId',
    name: 'direct-order',
    component: () =>
      import('@/resources/suppliers/views/CheckDirectOrder.vue'),
    meta: {
      hideFooter: true
    },

  },
  {
    path: '/fornecedor-em-manutencao',
    name: 'supplier-maintenance',
    component: () =>
      import('@/resources/suppliers/views/Maintenance.vue'),
    meta: {
      hideFooter: true,
      maintenance: true
    }
  },
  {
    path: '/fornecedor-cancelado',
    name: 'supplier-canceled',
    component: () =>
      import('@/resources/suppliers/views/Canceled.vue'),
    meta: {
      hideFooter: true,
      canceled: true
    }
  },
  
  
]

export default routes
