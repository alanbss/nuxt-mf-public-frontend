<template>
  <!-- Modal - Sem Fornecedores disponíveis -->
  <vs-popup title="" :active.sync="open">
    <div class="row m-0 p-1">
      <img width="150" class="mb-1" :src="require(`~/assets/images/logo-horizontal-01.png`)">
      <h6 class="mt-1">
        Lançaremos o sistema em breve.
        <br>
        No momento estamos apenas cadastrando os fornecedores parceiros. Entre em contato!
      </h6>
    </div>
    <div class="row m-0 p-1">
      <!-- <button type="text" class="btn btn-primary float-left btn-inline text-bold-600">Abrir o guia</button> -->
      <button
        v-if="cancel"
        @click="open = false"
        type="button"
        class="btn btn-link float-right"
      >
        Cancelar
      </button>
    </div>
  </vs-popup>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";

export default {
  name: "NoSuppliersModal",
  data() {
    return {
      open: false
    }
  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    }
  },
  computed: {

  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    cancel: {
      type: Boolean
    },
  },
  components: {

  }
};
</script>
