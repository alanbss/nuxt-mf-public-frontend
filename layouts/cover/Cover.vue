<template>
  <div>
    <v-navbar />
    <router-view />

    <browser-compatibility-warning/>

    <v-footer />
  </div>
</template>

<script>
import VNavbar from "./components/VNavbar";
import VFooter from "./components/VFooter";
import browserCompatibilityWarning from "~/components/general/BrowserCompatibilityWarning";

export default {
  name: "Cover",
   metaInfo: {

      title: 'Meu Fornecedor | Compre online para seu restaurante',
      titleTemplate: null,

      meta: [
        {name: 'description',
        content: 'Simplifique as compras do seu restaurante, padaria, minimercado. Veja os preços de várias distribuidoras. Alimentos, bebidas, embalagens, limpeza, utensílios.'},
      ]
   },
  data() {
    return {

    };
  },
  mounted() {

  },
  beforeDestroy() {

  },
  components: {
    VNavbar,
    VFooter,
    browserCompatibilityWarning
  }
};
</script>
