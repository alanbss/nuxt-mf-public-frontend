<template>
  <div>
    <main id="main">

      <section class="breadcrumbs">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center">
            <h2>Quem somos</h2>
          </div>
        </div>
      </section>

      <section class="inner-page">
        <div class="container">
          <p>
            Bares, restaurantes, padarias, mercados merecem uma rotina de compras mais prática e mais barata! Chegou a hora da digitalização resolver os mesmos problemas vividos todos os dias pelos compradores (e pelos vendedores dos fornecedores).
          </p>

          <br>

          <div class="row d-flex align-items-center">
            <div class="col-lg-6">
              <img :src="require(`@/assets/images/nao-e-facil-ser-comprador.jpg`)" class="img-fluid mx-auto rounded">
            </div>
            <div class="col-lg-6">
              <div class="pr-4">
                <h2 class="pt-4 pt-lg-0">A rotina de compras</h2>
                <h4 class="text-muted">Não é fácil ser comprador</h4><br>
                <p>
                  A rotina de compras é semelhante para todo tipo negócio. Seja restaurante, padaria, hotel, minimercado, bar, lanchonete, supermercado... O estoque está sempre em movimento, pois o consumo de alimentos, bebidas, embalagens, utensílios e produtos de limpeza é muito intenso.
                </p>
              </div>
            </div>
          </div>

          <br><hr><br>

          <div class="row d-flex align-items-center">
            <div class="col-lg-6">
              <div class="pr-4">
                <h2>O desafio</h2>
                <h4 class="text-muted">A rotina é muito limitada</h4><br>
                <p>
                  Só que cotar e comprar é muito trabalhoso, cansativo e repetitivo. O comprador passa muito tempo aguardando preços, falhas no pedido de compra são descobertas tardes demais, a rotina fica limitada aos mesmos fornecedores de sempre, a variação de produtos fica limitada por falta de acesso, etc.
                </p>
              </div>
            </div>
            <div class="col-lg-6">
              <img :src="require(`@/assets/images/a-rotina-e-muito-limitada.jpg`)" class="img-fluid mx-auto rounded">
            </div>
          </div>

          <br><hr><br>

          <div class="row d-flex align-items-center">
            <div class="col-lg-6">
              <img :src="require(`@/assets/images/comprar-deveria-ser-economizar.jpg`)" class="img-fluid mx-auto rounded">
            </div>
            <div class="col-lg-6">
              <div class="pr-4">
                <h2 class="pt-4 pt-lg-0">O custo alto</h2>
                <h4 class="text-muted">Comprar deveria ser economizar</h4><br>
                <p>
                  O resultado disso, é claro, é custo alto. O comprador poderia trazer mais economia para o negócio se pudesse negociar com mais fornecedores a cada compra. E traria mais segurança na hora do recebimento se houvesse uma ferramenta que organizasse os pedidos emitidos.
                </p>
              </div>
            </div>
          </div>

          <br><hr><br>

          <div class="row d-flex align-items-center">
            <div class="col-lg-6">
              <div class="pr-4">
                <h2>A solução</h2>
                <h4 class="text-muted">Os fornecedores no mesmo lugar</h4><br>
                <p>
                  Por isso criamos o Meu Fornecedor. A primeira plataforma especializada nos insumos de rotina dos restaurantes. Alimentos, bebidas, embalagens, utensílios, descartáveis e limpeza. O comprador pode cotar com inúmeros fornecedores simultaneamente e emitir pedidos de compra para conferir na hora do recebimento.
                </p>
              </div>
            </div>
            <div class="col-lg-6">
              <img :src="require(`@/assets/images/meu-fornecedor-e-a-solucao-para-os-restaurantes.jpg`)" class="img-fluid mx-auto rounded">
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped src="@/assets/css/cover.css">
</style>

<style>
.text-muted {
  color: #6c757d!important;
}
</style>

<script>
// import FamilyCard from "@/resources/families/components/FamilyCard";
// import MeuFornecedorBanner from "~/components/home/MeuFornecedorBanner";
// import ProductListEmptyBanner from "~/components/home/ProductListEmptyBanner";

import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { mask } from "vue-the-mask";
import carousel from 'vue-owl-carousel'
import LoginDropdown from "~/components/login/LoginDropdown";
import PartnerModal from "@/resources/users/components/PartnerModal";
import NoSuppliersModal from "~/components/cover/NoSuppliersModal";
import ProductsService from "@/resources/products/services/index";
import SuppliersService from "@/resources/suppliers/services/index";
import FamiliesService from "@/resources/families/services/index";

export default {
  data() {
    return {

    };
  },
  async created() {

  },
  mounted() {

  },
  computed: {

  },
  watch: {

  },
  methods: {
    ...mapActions("navigationFilters", [
      "setCep",
      "setSupplierServes"
    ]),

    scrollToTop() {
      window.scrollTo(0,0)
    },
  },
  directives: {
    mask,
  },
  components: {

  },
};
</script>

<style>
  .icon-box:before {
    content: '';
  }
</style>
