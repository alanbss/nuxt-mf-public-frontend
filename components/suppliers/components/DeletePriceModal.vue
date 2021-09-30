<template>
  <span>
    <vs-popup title="" :active.sync="open">
      <div class="row m-0 pb-2 d-flex justify-content-center">
        <i class="feather icon-info text-danger" style="font-size: 7em;"></i>
      </div>
      <div class="row m-0 pl-1 pr-1 pb-1 d-flex justify-content-center">
        <h4>Não é possível deletar preço</h4>
      </div>
      <div class="row m-0 pl-1 pr-1 pb-1 d-flex justify-content-center">
        <h5 class="text-center">
          Se este produto está sem estoque, então marque "está indisponível".
        </h5>
      </div>
      <div class="row m-0 pl-1 pr-1 pb-1 d-flex justify-content-center">
        <p class="text-center">
          Mas se você parou de trabalhar com este produto em DEFINITIVO, entre em contato conosco para fazermos a remoção.
        </p>
      </div>
      <div class="row m-0 pb-1 d-flex justify-content-center">
        <vs-button @click="updateAndClose" color="primary" type="filled">Ok, entendi</vs-button>
      </div>
    </vs-popup>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DeletePriceModal",
  data() {
    return {
      open: false,
    }
  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-popup', this.open)
    }
  },
  computed: {

  },
  methods: {
    updateAndClose() {
      this.open = false
    }
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
