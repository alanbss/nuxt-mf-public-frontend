<template>
  <vs-popup title="" :active.sync="open">
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <i class="feather icon-alert-triangle mb-1" style="font-size: 8em; font-weight: lighter; color: #d12438;"></i>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <h4 style="color: #d12438; font-weight: bold;">Não há fornecedores disponíveis</h4>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <h6 style="margin: 1em 0.5em; text-align: center;">Infelizmente não há fornecedores disponíveis na sua<br> região no momento.</h6>
      <h6 style="margin: 0 1em 2em 1em;">Entraremos em contato quando isso mudar.</h6>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <button
        class="btn btn-primary btn-block"
        @click="goToHome()"
        style="width: 160px; padding-left: 5px; padding-right: 5px;"
      >
        Ir para home
      </button>
    </vs-row>
  </vs-popup>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";

export default {
  name: "OutOfRegionModal",
  data() {
    return {
      open: false,
    }
  },
  created() {

  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-modal', this.open)
    }
  },
  computed: {

  },
  methods: {
    goToHome() {
      window.location.href = '/'
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
