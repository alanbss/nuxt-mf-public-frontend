<template>
  <nav
    class="header-navbar navbar-expand-lg navbar navbar-with-menu fixed-top navbar-dark navbar-shadow bg-primary bg-mf-laranja"
  >
    <div class="navbar-wrapper">
      <div class="navbar-container content">
        <div class="navbar-collapse" id="navbar-mobile">
          <div class="mr-auto float-left bookmark-wrapper d-flex align-items-center">
            <ul class="nav navbar-nav">
              <li v-if="$auth.check() && !isCanceled" class="nav-item mobile-menu mr-auto">
                <a
                  class="nav-link nav-menu-main menu-toggle hidden-xs"
                  title="Menu principal"
                  @click="showSidebar"
                >
                  <i class="ficon feather icon-menu"></i>
                </a>
              </li>
              <li class="nav-item d-sm-block d-none">
                <span v-if="!logoRefresh">
                  <a @click="clickedLogo()" title="Meu Fornecedor">
                    <div class="brand-logo-mf"></div>
                  </a>
                </span>
                <span v-else>
                  <a href="javascript:window.location.reload(true)" title="Meu Fornecedor">
                    <div class="brand-logo-mf"></div>
                  </a>
                </span>

              </li>
              <li v-if="this.$route.name != 'quotation-panel'" class="nav-item d-sm-none d-block" style="align-self: center; padding-left: 15px;">
                <a title="Início" href="/">
                  <i class="ficon feather icon-home" />
                </a>
              </li>

              <li v-if="this.$route.name == 'quotation-panel'" class="nav-item d-sm-none d-block" style="align-self: center; padding-left: 15px;">
                <a title="Atualizar demandas" href="/cotacoes">
                  <i class="ficon feather icon-refresh-cw"/>
                </a>
              </li>

              <li v-if="this.$route.name == 'quotation-panel'" class="nav-item d-sm-block d-none" style="align-self: center; padding-left: 15px;">
                <a title="Atualizar demandas" href="/cotacoes" class="nav-link-search-wrapper d-md-block" style="padding:8px; font-size: small;">
                  <a>
                    <i class="ficon feather icon-refresh-cw" style="color: #0391D1 !important; color: rgb(3, 145, 209) !important;"/>
                  </a>
                  <span  style="color: #0391D1 !important; color: rgb(3, 145, 209) !important;margin-left: 10px; vertical-align: text-top;">
                    Atualizar demandas
                  </span>
                </a>
              </li>



            </ul>
          </div>
          <div class=" float-right bookmark-wrapper d-flex align-intems-center">
            <ul class="nav navbar-nav">
              <li v-if="$auth.check() && !isCanceled" class="nav-item mobile-menu mr-auto">
                <b-tooltip v-if="show && this.$route.meta.pricing" :show.sync="show" target="savePricesButton" :placement="tooltipPlacement()">
                  Lembre-se de salvar quando concluir
                </b-tooltip>
                <button
                  id="savePricesButton"
                  v-if="this.$route.meta.pricing"
                  class="btn btn-primary waves-effect waves-light font-small-3 mr-1"
                  @click="savePrices()"
                >
                  <!-- <b-spinner v-if="buttonLoading" small /> -->
                  <span>Salvar preços</span>
                </button>

                    <router-link
                      :to="{name: 'pricing'}"
                      v-if="($auth.user().supplierStatus == 'Liberado' || $auth.user().supplierStatus == 'Precificação') && $auth.user().supplierQuotationType == 'Automático' && !this.$route.meta.pricing"
                      class="btn btn-primary waves-effect waves-light font-small-3 mr-1"
                      href="javascript:void(0);"
                      @click="buttonSpinner()"
                    >
                      <b-spinner v-if="buttonLoading" small />
                      <span v-else >Preço e estoque</span>
                    </router-link>

                    <no-prices-modal
                      :openPopup="openNoPrices"
                      :noPriceCount="noPriceCount"
                      :routeName="'quotation-panel'"
                      :justOneButton="true"
                      @update-popup="updatePopup"
                      v-if="this.$route.meta.pricing" />

                    <ul class="nav navbar-nav float-right">
                      <profile-dropdown />
                    </ul>
              </li>
            </ul>
          </div>


        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ProfileDropdown from "./v-navbar/ProfileDropdown";
import NoPricesModal from "~/components/suppliers/components/NoPricesModal";
import { mixin as clickaway } from "vue-clickaway";
import { bus } from "@/main";

export default {
  name: "VNavbar",
  data() {
    return {
      showDropdown: false,
      openNoPrices: false,
      noPriceCount: 0,
      buttonLoading: false,
      show: false,
    };
  },
  mounted(){
    bus.$on("showSaveTooltip", () => {
      this.show = true
    })
  },
  computed: {
    ...mapState("quotations", ["deliveryInfo"]),
    ...mapState("products/supplierProductExpeditions", ["supplierProductExpeditions"]),
    isCanceled() {
      return this.$route.meta.canceled
    },
    isInMaintenance() {
      return this.$route.meta.maintenance
    },
    logoRefresh() {
      return this.$route.meta.logoRefresh
    },
    pricesSavedMessage() {
      return `Preços salvos.`;
    },
  },
  methods: {
    ...mapActions("products/supplierProductExpeditions", [
      "savePricing",
      "clearExpeditions"
    ]),
    ...mapActions("suppliers", [
      "updateDeliveryRate"
    ]),
    clickedLogo() {
      this.$auth.fetch().then(() => {
        this.$router.push({ name: 'home' })
      })
    },
    updatePopup(val) {
      this.openNoPrices = val
    },
    showSidebar() {
      let menuClassList = document.body.classList;

      if (menuClassList.contains("menu-hide")) {
        menuClassList.remove("menu-hide");
        menuClassList.add("menu-open");
        document.body.style.overflow = "hidden";
        document.querySelector(".sidenav-overlay").classList.remove("d-none");
        document.querySelector(".sidenav-overlay").classList.add("d-block");
      } else {
        menuClassList.remove("menu-open");
        menuClassList.add("menu-hide");
        document.body.style.overflow = "auto";
        document.querySelector(".sidenav-overlay").classList.remove("d-block");
        document.querySelector(".sidenav-overlay").classList.add("d-none");
      }
    },

    buttonSpinner(){
      this.buttonLoading = true;
      setTimeout(() => {
        this.buttonLoading = false
        ()}, 300)
    },
    savePrices() {
      this.updateDeliveryRate(this.deliveryInfo)
      this.savePricing(this.supplierProductExpeditions).then((response) => {
        this.noPriceCount = response
        if(response > 0)
          this.openNoPrices = true
        else {
          this.$auth.fetch().then(() => {
            this.notifyInfo2(this.pricesSavedMessage, "feather icon-save")
            this.$router.push({ name: 'quotation-panel' })
          })
        }
      })
    },
    tooltipPlacement(){
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return "botton"
      } else {
        return "left"
      }
    }
  },
  components: {
    ProfileDropdown,
    NoPricesModal
  },

  mixins: [clickaway],
};
</script>
