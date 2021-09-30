<template>
  <!-- Modal - Filtro Fornecedores -->
  <vs-popup title="Cadastro" :active.sync="open">
    <div class="row m-0 pb-2 d-flex justify-content-center">
      <i class="feather icon-info" style="font-size: 7em; color: SkyBlue;"></i>
    </div>
    <div class="row m-0 pb-1 d-flex justify-content-center">
      <h5 v-if="isOrder">Complete seu cadastro para continuar seu pedido.</h5>
      <h5 v-else >Complete seu cadastro para continuar sua cotação.</h5>
      <h5><b>É grátis, rápido e feito só uma vez!</b></h5>
    </div>
    <div class="row m-0 pb-1 d-flex justify-content-center">
      <vs-button @click="setOpen()" color="primary" type="filled" style="width: 120px">
      <b-spinner v-if="buttonLoading" small/>
      <span v-else>Fazer cadastro</span>
      </vs-button>
    </div>
  </vs-popup>
</template>

<script>

export default {
  name: "SignUpModal",
  data() {
    return {
      open: false,
      buttonLoading: false
    }
  },
  created() {

  },
  computed: {
    isOrder() {
      return this.$route.query.directOrder
    }
  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    }
  },
  methods: {
    setOpen(){
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.open = false
      }, 300);
    },
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
  },
  components: {

  },
};
</script>
