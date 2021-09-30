<template>
  <li >
    <div >
      <template v-if="!$auth.check()">
        <router-link :to="{name: 'login'}" class="dropdown-item">
          <b>
            <i class="feather icon-log-in"></i>Entrar / Cadastro
          </b>
        </router-link>
        <!-- <filter-products /> -->
      </template>
      <template v-else>
        <a
          class="dropdown-item disabled text-white"
          href="#"
          tabindex="-1"
          aria-disabled="true"
          style="background-color: darkgray !important;"
        >{{ user.name }}</a>
        <a
          class="dropdown-item disabled"
          href="#"
          tabindex="-1"
          aria-disabled="true"
        >{{ user.contactName }}</a>
        <template v-if="user.isSupplier">
          <div class="dropdown-divider"></div>
          <router-link :to="{ name: 'service-conditions' }" class="dropdown-item text-warning">
            <i class="fa fa-exchange"></i> Modo fornecedor
          </router-link>
        </template>
        <div class="dropdown-divider"></div>

        <business-data v-if="!isSuspended" />

        <account :key="accountKey" v-if="!isSuspended" />

        <a @click="logout"  class="dropdown-item">
          <i class="feather icon-log-out"></i> Sair
        </a>
      </template>
    </div>
  </li>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";
import Account from "./Account";
import BusinessData from "./BusinessData";
import FilterProducts from "../v-navbar/FilterProducts.vue"
import {mapActions} from "vuex";
export default {
  name: "ProfileDropdown",
  data() {
    return {
      accountKey: 0,
      show: false,
      user: this.$auth.user(),
    };
  },
  computed: {
    infoMessage() {
      return `Você saiu do sistema.`;
    },
    isSuspended() {
      return this.$route.meta.suspended
    }
  },
  methods: {
    forceRerender() {
      this.accountKey += 1;
    },
    ...mapActions("navigationFilters", ["setProductsAfterLogout", "clearFilterParams"]),
    ...mapActions("users/products", ["clearProductList"]),
    showTime() {
      this.forceRerender();
      this.show = !this.show;
    },
    awayFromDropdownButton() {
      this.show = false;
    },
    logout() {

      this.setProductsAfterLogout()
      this.clearProductList()
      this.$auth.logout().then(() => {
        this.clearFilterParams()
        localStorage.removeItem('access-token')
        localStorage.removeItem('uid')
        localStorage.removeItem('client')
        this.notifyInfo(this.infoMessage, "feather icon-log-out")
        if(this.$router.name == 'home'){
          this.$router.go()
        }else{
          this.$router.push({name: 'home'})
        }

      })
    },
  },
  components: {
    Account,
    BusinessData,
    // FilterProducts
  },
  mixins: [clickaway],
  props: {
    color: {
      type: String
    }
  }
};
</script>
