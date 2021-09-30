<template>
  <div>
    <vs-sidebar
      :reduce="reduce"
      :reduce-not-hover-expand="notExpand"
      default-index="1"
      color="success"
      class="sidebarx"
      spacer
      v-model="active"
      hidden-background
    >
      <div style="padding-top: 10px" v-on-clickaway="away">
        <div
          :class="reduce ? 'd-none' : 'd-block'"
          class="header-sidebar"
          slot="header"
          style="justify-content: space-between; padding-bottom: 50px"
        >
          <div
            style="
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-evenly;
            "
          >
            <img
              src="@/assets/images/logo-horizontal-01.png"
              height="50px"
              alt=""
            />
            <a style="align-self: center" @click="reduce = !reduce"
              ><i style="font-weight: 900" class="feather icon-x"></i
            ></a>
          </div>
        </div>
        <div
          :class="reduce ? 'd-block' : 'd-none'"
          class="header-sidebar"
          slot="header"
          style="text-align-last: center; padding-bottom: 50px"
        >
          <a @click="reduce = !reduce">
            <img src="@/assets/images/menu3linhas.png" height="30px" alt="" />
          </a>
        </div>

        <div>
          <a href="/" :class="reduce ? 'a-reduced' : 'a-expanded'">
            <div>
              <img
                :class="this.$route.name == 'home' ? 'd-inherit' : 'd-none'"
                src="@/assets/images/menu2.png"
                height="25px"
                width="25px"
                alt="menu"
              />
              <img
                :class="this.$route.name == 'home' ? 'd-none' : 'd-inherit'"
                src="@/assets/images/menu1.png"
                height="25px"
                width="25px"
                alt="menu"
              />
              <b-badge
                v-if="this.unseenPrices"
                pill
                variant="success"
                style="font-size: xx-small; margin-left: -10px"
                >⠀</b-badge
              >
            </div>
            <span
              :class="reduce ? 'text-reduced' : 'text-expanded'"
              :style="
                this.$route.name == 'home'
                  ? 'font-weight: 900;'
                  : 'font-weight: normal;'
              "
              >Início</span
            >
          </a>

          <a
            :class="reduce ? 'a-reduced' : 'a-expanded'"
            href="/cotar-em-massa"
          >
            <div>
              <img
                src="@/assets/images/cmassa2.png"
                :class="this.$route.name == 'cotar' ? 'd-inherit' : 'd-none'"
                height="22px"
                width="22px"
                alt="menu"
              />
              <img
                src="@/assets/images/cmassa1.png"
                :class="this.$route.name == 'cotar' ? 'd-none' : 'd-inherit'"
                height="25px"
                width="22px"
                alt="menu"
              />
              <b-badge
                v-if="this.productsInQuoteCart > 0"
                pill
                variant="warning"
                style="font-size: xx-small; margin-left: -10px"
                >⠀</b-badge
              >
            </div>
            <span
              :class="reduce ? 'text-reduced' : 'text-expanded'"
              :style="
                this.$route.name == 'cotar'
                  ? 'font-weight: 900;'
                  : 'font-weight: normal;'
              "
              >Cotar</span
            >
          </a>

          <a :class="reduce ? 'a-reduced' : 'a-expanded'" href="/fornecedores">
            <div>
              <img
                src="@/assets/images/loja2.png"
                :class="
                  this.$route.name == 'suppliers' ? 'd-inherit' : 'd-none'
                "
                height="25px"
                alt="menu"
              />
              <img
                src="@/assets/images/loja1.png"
                :class="
                  this.$route.name == 'suppliers' ? 'd-none' : 'd-inherit'
                "
                height="25px"
                width="25px"
                alt="menu"
              />
              <b-badge
                v-if="this.productsInStoreCart"
                pill
                variant="warning"
                style="font-size: xx-small; margin-left: -10px"
                >⠀</b-badge
              >
            </div>
            <span
              :class="reduce ? 'text-reduced' : 'text-expanded'"
              :style="
                this.$route.name == 'suppliers'
                  ? 'font-weight: 900;'
                  : 'font-weight: normal;'
              "
              >Pedir direto</span
            >
          </a>
        </div>

        <vs-divider :class="reduce ? 'd-none' : 'd-block'" />

        <div>
          <a
            v-if="this.$auth.check()"
            href="/minhas-cotacoes"
            :class="reduce ? 'd-none' : 'a-expanded'"
          >
            <img
              src="@/assets/images/quotation.png"
              height="25px"
              width="25px"
              alt="menu"
            />
            <span class="text-expanded">Cotações realizadas</span>
          </a>

          <a
            v-if="this.$auth.check()"
            href="/pedidos-de-compra"
            :class="reduce ? 'd-none' : 'a-expanded'"
          >
            <img
              src="@/assets/images/invoice.png"
              height="22px"
              width="22px"
              alt="menu"
            />
            <span class="text-expanded">Pedidos de compra</span>
          </a>
        </div>

        <vs-divider :class="reduce ? 'd-none' : 'd-block'" />
        <profile-dropdown :class="reduce ? 'd-none' : 'd-block'" />
        <filter-products :class="reduce ? 'd-none' : 'd-block'" />
        <vs-divider :class="reduce ? 'd-none' : 'd-block'" />

        <div
          style="list-style: none; padding: 15px"
          :class="reduce ? 'd-none' : 'd-block'"
        >
          <about />
          <contact />
          <terms />
        </div>
      </div>
    </vs-sidebar>
  </div>
</template>

<style>
.a-reduced {
  color: black;
  display: flex;
  flex-flow: row wrap;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 15px;
}
.a-expanded {
  color: black;
  display: flex;
  margin-left: 15px;
  padding-bottom: 10px;
}
.text-expanded {
  margin-left: 15px;
}
.text-reduced {
  margin-left: 0;
  font-size: small;
}
.sidebarx {
  color: black;
}
.vs-sidebar.vs-sidebar-reduce {
  max-width: 65px;
  border-radius: 0 10px 10px 0;
}
.vs-sidebar.vs-sidebar-parent {
  position: fixed;
  height: 100% !important;
  top: 0;
}
</style>


<script>
import { mapState } from "vuex";
import { mixin as clickaway } from "vue-clickaway";
import About from "./v-sidebar/About";
import Terms from "./v-sidebar/Terms";
import Contact from "./v-sidebar/Contact";
import ProfileDropdown from "./v-navbar/ProfileDropdown.vue";
import FilterProducts from "./v-navbar/FilterProducts.vue"
import QuotesService from "@/resources/quotes/Services/quotes.services";
export default {
  data() {
    return {
      reduce: true,
      active: true,
      notExpand: true,
      showSecondaryIcons: false,
      openQuotes: [],
      openDirectOrders: [],
      unseenPrices: false,
    };
  },
  created() {
    if(this.$auth.check()) {
      QuotesService.getOpen().then((response) => {
        this.openQuotes = response.data;
        this.checkOpenQuotes();
        this.checkUnseenPrices();
      });
    }
  },
  computed: {
    ...mapState("users/products", ["productQuoteCart"]),
    ...mapState("users/products", ["storeProducts"]),

    productsInQuoteCart() {
      if (this.$store.state.users.products.productQuoteCart)
        return this.$store.state.users.products.productQuoteCart.length;
      else return 0;
    },
    productsInStoreCart() {
      if (this.$store.state.users.products.storeProducts)
        return this.$store.state.users.products.storeProducts.length;
      else return 0;
    },
  },
  methods: {
    checkOpenQuotes() {
      for (var i = 0; i < this.openQuotes.length; i++) {
        if (this.openQuotes[i].hasExpired == false) {
          this.hasQuoteInProgress++;
        }
      }
    },
    checkUnseenPrices() {
      for (var i = 0; i < this.openQuotes.length; i++) {
        if (
          this.openQuotes[i].notRead > 0 &&
          this.openQuotes[i].hasExpired == false
        ) {
          this.unseenPrices = true;
        }
      }
    },
    away() {
      this.reduce = true;
    },
  },
  components: {
    Terms,
    Contact,
    About,
    ProfileDropdown,
    FilterProducts
  },
  mixins: [clickaway],
};
</script>
    Terms
