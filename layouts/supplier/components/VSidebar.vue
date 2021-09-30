<template>
  <div
    class="main-menu menu-fixed menu-light menu-accordion menu-shadow expanded"
    data-scroll-to-active="true"
  >
    <div class="navbar-header expanded">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item mr-auto">
          <a class="navbar-brand" href="#x">
            <div class="brand-logo"></div>
            <h2 class="brand-text mb-0">Meu Fornecedor</h2>
          </a>
        </li>
        <li class="nav-item nav-toggle">
          <a
            @click="closeSideBar"
            class="nav-link modern-nav-toggle pr-0"
            data-toggle="collapse"
          >
            <i class="feather icon-x font-medium-4 primary toggle-icon"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="shadow-bottom"></div>
    <div class="main-menu-content">
      <vue-custom-scrollbar class="scroll-area" :settings="settings">
        <ul
          class="navigation navigation-main"
          id="main-menu-navigation"
          data-menu="menu-navigation"
        >
          <open-quotations v-if="$auth.user().supplierStatus == 'Liberado' || $auth.user().supplierStatus == 'Manutenção'" />

          <update-prices v-if="($auth.user().supplierStatus == 'Liberado' || $auth.user().supplierStatus == 'Precificação') && $auth.user().supplierQuotationType == 'Automático'" />

          <my-catalog v-if="$auth.user().supplierStatus == 'Liberado' || $auth.user().supplierStatus == 'Manutenção'" />

          <li class="navigation-header">
            <span>ATENDIMENTO AO SEU CLIENTE</span>
          </li>

          <client-type />

          <delivery-areas />

          <delivery-conditions />

          <minimum-order-value />

          <div class="divider">
            <hr class="m-0" />
          </div>

          <about />

          <contact />

          <terms />
        </ul>
      </vue-custom-scrollbar>
    </div>
  </div>
</template>

<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import OpenQuotations from "./v-sidebar/OpenQuotations";
import MyCatalog from "./v-sidebar/MyCatalog";
import UpdatePrices from "./v-sidebar/UpdatePrices";
import ClientType from "./v-sidebar/ClientType";
import DeliveryAreas from "./v-sidebar/DeliveryAreas";
import DeliveryConditions from "./v-sidebar/DeliveryConditions";
import MinimumOrderValue from "./v-sidebar/MinimumOrderValue";
import About from "./v-sidebar/About";
import Terms from "./v-sidebar/Terms";
import Contact from "./v-sidebar/Contact";

export default {
  name: "VSidebar",
  data() {
    return {
      settings: {
        maxScrollbarLength: 250,
        wheelSpeed: 0.8,
      },
    };
  },
  methods: {
    closeSideBar() {
      let menuClassList = document.body.classList;

      if (menuClassList.contains("menu-open")) {
        menuClassList.remove("menu-open");
        menuClassList.add("menu-hide");
        document.body.style.overflow = "auto";
        document.querySelector(".sidenav-overlay").classList.remove("d-block");
        document.querySelector(".sidenav-overlay").classList.add("d-none");
      }
    },
  },
  components: {
    vueCustomScrollbar,
    OpenQuotations,
    MyCatalog,
    ClientType,
    DeliveryAreas,
    DeliveryConditions,
    MinimumOrderValue,
    About,
    Contact,
    Terms,
    UpdatePrices
  },
};
</script>

<style >
.scroll-area {
  position: relative;
  margin: auto;
  height: 100%;
}
</style>
