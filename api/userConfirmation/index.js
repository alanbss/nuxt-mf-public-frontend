import axios from 'axios'

const MF_BACKEND = process.env.VUE_APP_REST_API_URL


const USER_CONFIRMATION = {
  get(confirmationToken) {
    return axios.get(`${MF_BACKEND}/user_auth/confirmation`, {
      params: {
        config_name: 'default',
        confirmation_token: confirmationToken,
      }
    })
  }
}

export default USER_CONFIRMATION