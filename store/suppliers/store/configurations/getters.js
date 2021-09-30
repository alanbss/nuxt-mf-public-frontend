export default {
  clientTypeCompleted: state => {

    return state.configuration.servesCpf !== null || state.configuration.servesCnpj !== null
  },

  minimumOrderValueCompleted: state => state.configuration.minimumOrderValue !== null,

  deliveriesCompleted: state => {
    return state.configuration.noDeliveries !== null && state.configuration.deliveryEstimate !== null && state.configuration.deliveryRoute !== null
  },

  deliveryAreasCompleted: state => state.configuration.deliveryAreas !== false,
  paymentMethodsCompleted: state => state.configuration.paymentMethods !== false,

  allCompleted: (state, getter) => {
    //return getter.clientTypeCompleted && getter.deliveryAreasCompleted && getter.deliveriesCompleted && getter.minimumOrderValueCompleted && getter.paymentMethodsCompleted
    return getter.clientTypeCompleted && getter.deliveryAreasCompleted && getter.deliveriesCompleted && getter.minimumOrderValueCompleted
  },
  allCompletedAutomatic: (state, getter) => {
    return getter.clientTypeCompleted && getter.deliveryAreasCompleted && getter.deliveriesCompleted && getter.minimumOrderValueCompleted
  },
}
