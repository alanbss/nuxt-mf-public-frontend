<template>
  <vs-popup :title="product.productTypeName" :active.sync="open">
    <div class="row m-0">
      <div class="col-12 m-0 d-flex justify-content-center">
        <img v-if="product.picture" class="rounded img-fluid" width="200" :src="product.picture" alt  />
        <img v-else class="rounded img-fluid" width="200" :src="noImageSrc" alt />
      </div>
    </div>
  </vs-popup>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";

export default {
  name: "ProductPhotoModal",
  data() {
    return {
      open: false,
      noImageSrc: require(`~/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`)
    }
  },
  created() {

  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      if(this.sendId)
        this.$emit('update-modal', this.open, this.product.id)
      else
        this.$emit('update-modal', this.open)
    }
  },
  computed: {

  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    openPopup: {
      type: Boolean,
      required: true,
    },
    sendId: {
      type: Boolean
    }
  },
  components: {

  }
};
</script>
