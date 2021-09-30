<template>
  <div class="card" :class="this.mobileBrowser ? 'card-mobile' : 'card-height-hd'">
    <div style=" display: flex; flex-direction: row; justify-content: space-between">
      <div class="p-1">
        <h5>Cotações realizadas</h5>
        <h6>
          <small>Veja os preços dos produtos solicitados</small>
        </h6>
      </div>
      <a
        class="p-1"
        href="/minhas-cotacoes"
        style="white-space: nowrap;"
        v-if="this.openQuotes.length"
      >Ver tudo</a>
    </div>
    <div v-if="this.openQuotes.length">
      <div :class="this.mobileBrowser ? 'col-mobile' : 'col-height-hd'" v-if="updated">
        <VQuoteCard
          :quote="quote"
          v-for="quote in printQuotes()"
          :key="quote.id"
          class="p-1"
        />
        <div class="divider" v-if="remaining > 0">
          <div></div>
        </div>
      </div>
      <div v-else class="d-flex justify-content-center">
        <div class="spinner-border" style="width: 5rem; height: 5rem" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="p-1">
        <h6>Você ainda não abriu nenhuma cotação.</h6>
        <button @click="goToMassQuotation()" class="btn btn-outline-primary">Fazer cotação em massa</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VQuoteCard from "~/components/quotes/Components/VQuoteCard";

export default {
  data() {
    return {
      updated: false,
      remaining: 0,
      buttonLoading: false,
      totalCount: 0,
      total: 0,
      mobileBrowser: false,
    };
  },

  created() {
    this.isMobile();
    this.defineTotal();
    this.getOpenQuotes().then(() => {
      this.updated = true;
    });
    this.getQuoteCount().then((response) => {
      this.totalCount = response;
    });
  },

  computed: {
    ...mapState("quotes", ["openQuotes"]),
  },

  methods: {
    ...mapActions("quotes", ["getOpenQuotes", "getQuoteCount"]),
    printQuotes() {
      return this.openQuotes.slice(0, this.defineTotal());
    },
    toAllQuotes() {
      this.buttonLoading = true;
      setTimeout(() => {
        this.buttonLoading = false;
        this.$router.push({ name: "users.allQuotes" });
      }, 300);
    },
    isFHD() {
      if (screen.width > 1366 || window.innerWidth > 1366) {
        return "fhd";
      } else {
        return "hd";
      }
    },
    goToMassQuotation() {
      this.$router.push({ name: "cotar" });
    },
    defineTotal() {
      if (screen.width > 1366 || window.innerWidth > 1366) {
        return 9;
      } else if (this.mobileBrowser) {
        return 6;
      } else {
        return 6;
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
  },
  components: {
    VQuoteCard,
  },
};
</script>

<style>
.card-mobile {
  background: rgb(251, 253, 254);
  width: 100%;
}
.card-height-hd {
  background: rgb(251, 253, 254);
  margin-right: 25px;
  width: 650px;
  height: 85vh;
}
.col-height-hd {
  max-height: 70vh;
  display: flex;
  flex-flow: row wrap;
  align-content: space-evenly;
  justify-content: center;
}
.col-mobile {
  display: flex;
  align-content: space-evenly;
  flex-direction: row;
  overflow: auto;
}
</style>
