// import { checkUserStatus } from "@/mixins/statusChecker"
// import store from '@/store/'
// import Vue from 'vue'
//
// const routes = [
//   {
//     path: "/condicoes-de-atendimento",
//     name: "service-conditions",
//     component: () => import("~/components/suppliers/views/ServiceConditions.vue"),
//     meta: {
//       auth: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//     }
//   },
//   {
//     path: "/tipos-de-cliente",
//     name: "client-types",
//     component: () => import("~/components/suppliers/views/ClientTypes.vue"),
//     meta: {
//       auth: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//     }
//   },
//   {
//     path: "/valor-minimo-de-pedido",
//     name: "minimum-order-value",
//     component: () => import("~/components/suppliers/views/MinimumOrderValue.vue"),
//     meta: {
//       auth: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//     }
//   },
//   {
//     path: "/prazo-de-entrega",
//     name: "delivery-conditions",
//     component: () => import("~/components/suppliers/views/DeliveryConditions.vue"),
//     meta: {
//       auth: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//     }
//   },
//   {
//     path: "/area-de-atendimento",
//     name: "delivery-areas",
//     component: () => import("~/components/suppliers/views/DeliveryAreas.vue"),
//     meta: {
//       auth: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//     }
//   },
//   {
//     path: "/tipos-de-pagamento",
//     name: "payment-methods",
//     component: () => import("~/components/suppliers/views/PaymentMethods.vue"),
//     meta: {
//       auth: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//     }
//   },
//   {
//     path: "/cotacoes",
//     name: "quotation-panel",
//     component: () => import("~/components/suppliers/views/QuotationPanel.vue"),
//     meta: {
//       auth: true,
//       hideFooter: true,
//       logoRefresh: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//       const userLoggedIn = Vue.auth.check()
//       if (userLoggedIn) {
//         if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Precificação') {
//           next('/precificar')
//         } else if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Não liberado') {
//           next('/condicoes-de-atendimento')
//         } else if (!Vue.auth.user().isSupplier) {
//           next('/')
//         }
//       }
//     }
//   },
//   {
//     path: "/responder-cotacao/:quotationId",
//     name: "reply-quotation",
//     component: () => import("~/components/suppliers/views/ReplyQuotationInfo.vue"),
//     meta: {
//       auth: true,
//       hideFooter: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//     }
//   },
//   {
//     path: "/incluir-produtos",
//     name: "products-empty",
//     component: () => import("~/components/suppliers/views/ProductsEmpty.vue"),
//     meta: {
//       auth: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//       const userLoggedIn = Vue.auth.check()
//       if (userLoggedIn) {
//         if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Precificação') {
//           next('/precificar')
//         } else if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Liberado') {
//           next('/cotacoes')
//         }
//       }
//     },
//   },
//   {
//     path: "/meu-catalogo",
//     name: "my-catalog",
//     component: () => import("~/components/suppliers/views/Catalog.vue"),
//     meta: {
//       auth: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//       if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Não liberado') {
//         next('/condicoes-de-atendimento')
//       }
//     }
//   },
//   {
//     path: "/precificar",
//     name: "pricing",
//     component: () => import("~/components/suppliers/views/Pricing.vue"),
//     meta: {
//       auth: true,
//       pricing: true,
//       hideFooter: true
//     },
//     beforeEnter: (to, from, next) => {
//       checkUserStatus(to, from, next, store)
//       if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Não liberado') {
//         next('/condicoes-de-atendimento')
//       } else if (Vue.auth.user().isSupplier && !Vue.auth.user().isAutomatic) {
//         next('/')
//       } else if (!Vue.auth.user().isSupplier) {
//         next('/')
//       }
//     }
//   },
//   {
//     path: '/pedido/:quotationId',
//     name: 'supplier-order',
//     component: () =>
//       import('~/components/suppliers/views/CheckOrder.vue'),
//     meta: {
//       hideFooter: true
//     },
//
//   },
//   {
//     path: '/compra/:orderId',
//     name: 'direct-order',
//     component: () =>
//       import('~/components/suppliers/views/CheckDirectOrder.vue'),
//     meta: {
//       hideFooter: true
//     },
//
//   },
//   {
//     path: '/fornecedor-em-manutencao',
//     name: 'supplier-maintenance',
//     component: () =>
//       import('~/components/suppliers/views/Maintenance.vue'),
//     meta: {
//       hideFooter: true,
//       maintenance: true
//     }
//   },
//   {
//     path: '/fornecedor-cancelado',
//     name: 'supplier-canceled',
//     component: () =>
//       import('~/components/suppliers/views/Canceled.vue'),
//     meta: {
//       hideFooter: true,
//       canceled: true
//     }
//   },
//
//
// ]
//
// export default routes
