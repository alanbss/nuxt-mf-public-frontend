<template>
  <vs-popup title="" :active.sync="open">
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <i class="feather icon-map mb-1" style="font-size: 8em; font-weight: lighter;"></i>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <h4>Não encontramos o CEP digitado.</h4>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <p>Confira se você digitou corretamente.</p>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="center" vs-align="center" >
      <button
        class="btn btn-primary btn-block"
        @click="open = false"
        style="width: 130px;"
      >
        Fechar
      </button>
    </vs-row>
  </vs-popup>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";

export default {
  name: "PartnerModal",
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
