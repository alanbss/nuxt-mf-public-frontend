<template>
  <div class="content-wrapper pb-4">
    <loading-overlay
      :active.sync="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :color="color"
      :background-color="backgroundColor"
      :opacity="opacity"
      :width="width"
      :height="height"
    />
    <div class="content-body">
        <div class="row rounded-top">
          <div class="col-12">
            <h2 class="content-header-title">Todas as cotações</h2>
            <p>Enquanto estiverem abertas, os fornecedores podem apresentar seus preços e você pode emitir pedidos de compra.</p>
            <div class="position-relative mb-2">
              <a href="javascript:void(0)" @click="closeChip" class="mr-50">Últimos 14 dias </a>
              <b-form-datepicker
                class="mr-50"
                id="datepicker"
                button-only
                v-model="dateSelected"
                locale="pt-BR">
              </b-form-datepicker>
              <div v-if="dateSelected" class="chip border border-light bg-white mb-25 mr-50">
                <div class="chip-body">
                  <span class="chip-text text-primary">{{ dateSelectedFormatted }}</span>
                  <div @click="closeChip" class="chip-closeable ml-0">
                    <i class="feather icon-x text-primary font-weight-bold"></i>
                  </div>
                </div>
              </div>

              <a href="javascript:void(0)" :class="closedQuotesClass" @click="toggleChip('closed')">
                <span class="chip-body px-75">
                  <span class="chip-text font-weight-bold">Só encerradas</span>
                </span>
              </a>
              <a href="javascript:void(0)" :class="openQuotesClass" @click="toggleChip('open')">
                <span class="chip-body px-75">
                  <span class="chip-text font-weight-bold">Só abertas</span>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div class="row rounded-bottom" v-if="quotes.length > 0">
          <VQuoteCard
            v-for="quote in quotes"
            :key="quote.id"
            :quote="quote"
          />
        </div>
        <div class="row rounded-bottom" v-else>
          <h6 class="mt-1 ml-1" style="color: grey;">Sem cotações nesta data ou condição.</h6>
        </div>
    </div>
    <div v-show="quotes.length > 0" class="centered-paginator">
      <vs-pagination :total="totalPages" v-model="currentPage" :max="10" :color="'#7367F0'" />
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VQuoteCard from "@/resources/quotes/Components/VQuoteCard";

export default {
  data() {
    return {
      closedQuotes: false,
      openQuotes: false,
      dateSelected: null,
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
    };
  },

  created() {
    this.isLoading = true
    this.getClientQuotesByPageNumber({ closed: this.closedQuotes, open: this.openQuotes, date: this.dateSelected }).then(() => {
      this.isLoading = false
    })
  },

  watch: {
    currentPage(pageNumber) {
      this.userSelectedPage(pageNumber)
      this.getClientQuotesByPageNumber({ closed: this.closedQuotes, open: this.openQuotes, date: this.dateSelected })
    },
    dateSelected(newVal) {
      this.currentPage = 1
      this.userSelectedPage(1)
      this.getClientQuotesByPageNumber({ closed: this.closedQuotes, open: this.openQuotes, date: this.dateSelected })
    }
  },

  destroyed() {
    document.getElementById("app").classList.remove("vh-100");
    document
      .getElementsByClassName("content-wrapper")[0]
      .classList.add("router-view");
  },

  computed: {
    ...mapState("pagination", ["totalPages"]),
    ...mapState("quotes", ["quotes"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage;
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value);
      },
    },
    dateSelectedFormatted() {
      if(this.dateSelected) {
        var date = new Date(this.dateSelected)
        var year = date.getFullYear()
        var month = date.getMonth()+1
        var day = date.getDate()+1
        if (day < 10) {
          day = '0' + day
        }
        if (month < 10) {
          month = '0' + month
        }
        return day + '/' + month + '/' + year
      } else
        return null
    },
    closedQuotesClass() {
      if(this.closedQuotes)
        return "chip border border-light bg-white px-0 mb-25 mr-50 mf-chip-options chip-success"
      else
        return "chip border border-light bg-white px-0 mb-25 mr-50 mf-chip-options"
    },
    openQuotesClass() {
      if(this.openQuotes)
        return "chip border border-light bg-white px-0 mb-25 mr-50 mf-chip-options chip-success"
      else
        return "chip border border-light bg-white px-0 mb-25 mr-50 mf-chip-options"
    },
  },

  methods: {
    ...mapActions("pagination", ["userSelectedPage"]),
    ...mapActions("quotes", ["getClientQuotesByPageNumber"]),
    toggleChip(chip) {
      if(chip == 'open') {
        this.openQuotes = !this.openQuotes
        this.closedQuotes = false
      } else {
        this.closedQuotes = !this.closedQuotes
        this.openQuotes = false
      }
      this.currentPage = 1
      this.userSelectedPage(1)
      this.getClientQuotesByPageNumber({ closed: this.closedQuotes, open: this.openQuotes, date: this.dateSelected })
    },
    closeChip() {
      this.dateSelected = null
    }
  },
  components: {
    VQuoteCard,
  }
};
</script>
