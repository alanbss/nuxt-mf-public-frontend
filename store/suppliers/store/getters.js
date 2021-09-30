export default {
  stateIsPresent: state => state.selectedState !== null,
  stateName: (state, getters) => getters.stateIsPresent ? `Região do ${state.selectedState.name}` : "",
  regions: (state, getters) => getters.stateIsPresent ? state.selectedState.regions : [],
  paymentMethodsWithId: (state) => state.paymentMethods.filter(paymentMethod => paymentMethod.id !== undefined),
  paymentMethodsWithoutId: (state) => state.paymentMethods.filter(paymentMethod => paymentMethod.id === undefined)
}