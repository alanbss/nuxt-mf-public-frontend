import Vue from 'vue'
import StateService from "@/resources/users/services/StateService";

export function checkAvailableState(to, from, next, store, uf) {
  if(uf) {
    StateService.checkForAvailableUf(uf).then((response) => {
      if(response.data.available == 'no')
        next()
    })
  }
}

export default {
  methods: {
    checkAvailableState
  }
}
