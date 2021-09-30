<template>
  <vs-popup title="Saiba mais" :active.sync="open">
    <h6>{{ client.user.name }}</h6>
    <h6 v-if="client.user.cnpj">{{ formattedCnpj }}</h6>
    <h6 v-if="client.user.cpf">{{ formattedCpf }}</h6>
    <br>
    <h6>{{ client.user.street }}, {{ client.user.addressDetails }}</h6>
    <h6>{{ client.user.neighborhood }} - {{ client.user.city }}/{{ client.user.stateUf }}</h6>
    <h6>{{ client.user.zipcode }}</h6>
    <br>
    <h6>{{ client.user.phone }}</h6>
    <h6>{{ client.user.email }}</h6>
  </vs-popup>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      open: false
    }
  },
  created() {

  },
  computed: {
    formattedCnpj() {
      return this.client.user.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5')
    },
    formattedCpf() {
      return this.client.user.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4')
    },
  },
  watch: {
    open() {
      this.$emit('updated-popup', this.open)
    },
    popupActive() {
      this.open = this.popupActive
    }
  },
  props: {
    client: {
      type: Object,
      required: true
    },
    popupActive: {
      type: Boolean,
      required: true
    }
  },
};
</script>
