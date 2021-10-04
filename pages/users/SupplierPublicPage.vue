<template>
<div v-if="supplier">
  <div v-if="supplier.user.isAutomatic">
    <catalog-store />
  </div>
  <div v-else>
    <catalog-public />
  </div>
  <vs-popup class="holamundo" title=" " :active.sync="showLeavingPopup">
    <div  style="text-align: center;">
      <img class="m-2" src="~/assets/images/warning.png" height="100px" alt="">
      <h4 class="m-2" style="color: red;">Tem certeza que deseja sair da loja?</h4>
      <h6>Você perderá o pedido de compra que estava montando.</h6>
      <div class="m-2" style="white-space: nowrap;">
        <button class="btn btn-outline-primary"  style="margin: 10px;" @click="leaveStore(routeName)">Sair da loja</button>
        <button class="btn btn-primary" style="margin: 10px;" @click="showLeavingPopup = false">Permanecer</button>
      </div>
    </div>
  </vs-popup>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import CatalogStore from "~/components/users/views/CatalogStore";
// import CatalogPublic from "~/components/users/views/CatalogPublic";

export default {
  metaInfo() {
    return {
      title: this.titleContent,
      titleTemplate: "%s",
      meta: [
        { charset: "utf-8" },
        {
          vmid: "description",
          name: "description",
          content: this.descriptionContent,
        },
      ],
    };
  },
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      loading: false,
      slug: null,
      titleContent: null,
      descriptionContent: null,
      showLeavingPopup: false,
      routeName: '',
    };
  },
  beforeRouteLeave(to, from, next) {
    if(this.$store.state.users.products.storeProducts.length > 0 && !this.showLeavingPopup && to.name != 'users.reviewOrder' &&
        to.name != 'public-store' && to.name != 'public-store-search' &&
        to.name != 'public-store-family' && to.name != 'public-store-category' &&
        to.name != 'public-store-product'){
      this.routeName = to.name;
      this.showLeavingPopup = true;
    } else {
      next()
    }
  },
  created() {
    this.isLoading = true
    this.slug = this.$route.params.supplierSlug

    this.getSupplierBySlug(this.slug).then(() => {
      this.isLoading = false
      this.titleContent =
        this.supplier.user.name +
        " | Meu Fornecedor";
      this.descriptionContent =
        "Confira todos os produtos da " +
        this.supplier.user.name +
        ". Emita pedidos online para atender o seu restaurante, padaria, minimercado."
    }).catch(() => {
      this.$router.push({ path: 'erro/404' })
    })
  },


  mounted() {
  },

  computed: {
    ...mapState("suppliers", [
      "supplier",
    ]),

  },

  methods: {
    ...mapActions("suppliers", [
      "getSupplierBySlug",
    ]),

    leaveStore(routeName){
      this.$router.push({name: routeName})
    }

  },
  components: {
    CatalogStore,
    CatalogPublic,
  },
}
</script>
