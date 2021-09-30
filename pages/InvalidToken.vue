<template>
  <div>
    <div class="card mb-0 px-2 pb-2">
      <div class="card-header pb-1">
        <div class="card-title">
          <div class="d-none mobile-only-block" style="text-align: center;">
            <router-link :to="{name: 'home'}">
              <img src="~/assets/images/mf-login.png" style="max-width: 250px; margin-bottom: 20px;" alt />
            </router-link>
          </div>
          <h4 class="mb-0">O link expirou</h4>
          <h5>Já passaram 24 horas ou você solicitou muitos em pouco tempo.</h5>
        </div>
      </div>

      <div class="card-content pb-1">
        <div class="card-body pt-1">
          <p class="pb-1">Solicite a recuperação novamente.</p>
          <a
            href="javascript:void(0)"
            class="btn btn-primary float-left btn-inline"
            @click="openForgotPassword"
          >Solicitar nova geração de senha</a>
        </div>
      </div>
    </div>
    <forgot-password-modal :openPopup="openForgot" @update-modal="updateForgotPassword"/>
  </div>
</template>

<script>
import ForgotPasswordModal from "~/components/login/ForgotPasswordModal"

export default {
  data() {
    return {
      openForgot: false,
    };
  },
  computed: {

  },
  methods: {
    openForgotPassword() {
      this.openForgot = true
    },
    updateForgotPassword(value) {
      this.openForgot = value
    }
  },
  components: {
    ForgotPasswordModal
  }
};
</script>
