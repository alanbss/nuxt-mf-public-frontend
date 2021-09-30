import Vue from 'vue'

export function checkUserStatus(to, from, next, store) {
  const userLoggedIn = Vue.auth.check()

  const allowedRoutesMaintenance = [
    "delivery-areas",
    "delivery-conditions",
    "minimum-order-value",
    "client-types",
    "service-conditions"
  ]

  if (userLoggedIn) {
    Vue.auth.fetch().then(() => {
      if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Cancelado') {
        next('/fornecedor-cancelado')
      } else if (Vue.auth.user().isSupplier && Vue.auth.user().supplierStatus == 'Manutenção' && !allowedRoutesMaintenance.includes(to.name)) {
        next('/fornecedor-em-manutencao')
      } else if(!Vue.auth.user().isSupplier && (['Suspenso', 'Cancelado'].includes(Vue.auth.user().clientStatus))) {
        next('/conta-suspensa')
      } else {
        next()
      }
    })
  } else {
    let hasRegion = store.getters['navigationFilters/params']
    if(hasRegion.region_id && hasRegion.region_id != 'null')
      next()
    else
      next('/capa')
  }
}

export default {
  methods: {
    checkUserStatus
  }
}
