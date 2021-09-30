import Vue from 'vue'

const RESOURCE_URL = 'api/v1/contacts'

export default {
  sendMail(data) {
    return Vue.axios.post(`${RESOURCE_URL}`,
      { contact: {
          contact_name: data.contactName,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message }
      })
  },
  
  userAsSupplierData(data) {
    return Vue.axios.post(`${RESOURCE_URL}/as_supplier`,
      { contact: {
          contact_name: data.contactName,
          name: data.name,
          phone: data.phone,
          state: data.state,
          city: data.city,
          cnpj: data.cnpj,
          email: data.email, }
      })
  },

  partnerData(data) {
    return Vue.axios.post(`${RESOURCE_URL}/partner`,
      { contact: {
          contact_name: data.contactName,
          name: data.name,
          phone: data.phone }
      })
  },
}
