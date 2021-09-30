<template>
  <div class="card rounded-0 mb-0 px-2 text-center">
    <div class="card-header pb-1 d-block">
      <div class="card-title">
        <h4 class="mb-0 success">Cadastro concluído!</h4>
      </div>
    </div>
    <div class="card-content">
      <div class="card-body py-0">
        <p>Seu acesso já está liberado.</p>

        <div class="alert alert-dark" role="alert">
          <h4 class="alert-heading">
            <i class="fa fa-exclamation-circle fa-lg"></i>&nbsp; Não perca seu acesso!
          </h4>
          <p class="mb-0 font-small-3">
            Você tem 7 dias para confirmar sua conta clicando no link que mandamos para seu email.
            <br />
            Enviamos para: {{ userEmail }}
          </p>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <p>
        <a href="javascript:void(0);" @click="newQuote()" class="btn btn-primary text-bold-600">Continuar</a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState(["userEmail"]),
    ...mapState("users/products", [
      "productQuoteCart"
    ]),
  },
  created() {
    this.getQuoteCart()
  },
  methods: {
    ...mapActions("users/products", [
      "getQuoteCart",
    ]),
    newQuote() {
      if(this.productQuoteCart.length > 0) {
        this.$auth.fetch().then(() => {
          if (this.$auth.check()) {
            this.$router.push({ name: 'users.reviewQuote', query: { autoOpen: true } })
          } else {
            this.$router.push({ name: 'home' })
          }
        })
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  }
};
</script>
