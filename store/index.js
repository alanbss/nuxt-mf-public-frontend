
import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

// import users from "~/components/users/store/"
// import products from "~/components/products/store/"
// import productTypes from "~/components/productTypes/store/"
// import suppliers from "~/components/suppliers/store/"
// import clients from "~/components/clients/store/"
// import navigationFilters from "@/store/navigationFilters/"
// import families from "~/components/families/store/"
// import pagination from "@/store/pagination/"
// import quotes from '~/components/quotes/Store/'
// import quotations from '~/components/quotations/Store/'
// import orders from '~/components/orders/store/'


// const modules = {
//   pagination,
//   products,
//   users,
//   suppliers,
//   clients,
//   productTypes,
//   navigationFilters,
//   families,
//   quotes,
//   quotations,
//   orders,
// }

export const store = () => ({
  getters,
  mutations,
  state,
  actions,
  // modules,
  strict: process.env.NODE_ENV !== 'production'
})

// const initialStateCopy = JSON.parse(JSON.stringify(store.state))
//
// // Reseta toda a store
// export function resetState() {
//   store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)))
// }
