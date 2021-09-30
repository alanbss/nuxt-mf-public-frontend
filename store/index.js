
import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

import users from "@/resources/users/store/"
import products from "@/resources/products/store/"
import productTypes from "@/resources/productTypes/store/"
import suppliers from "@/resources/suppliers/store/"
import clients from "@/resources/clients/store/"
import navigationFilters from "@/store/navigationFilters/"
import families from "@/resources/families/store/"
import pagination from "@/store/pagination/"
import quotes from '@/resources/quotes/Store/'
import quotations from '@/resources/quotations/Store/'
import orders from '@/resources/orders/store/'


const modules = {
  pagination,
  products,
  users,
  suppliers,
  clients,
  productTypes,
  navigationFilters,
  families,
  quotes,
  quotations,
  orders,
}

export const store = () => ({
  getters,
  mutations,
  state,
  actions,
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

const initialStateCopy = JSON.parse(JSON.stringify(store.state))

// Reseta toda a store
export function resetState() {
  store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)))
}
