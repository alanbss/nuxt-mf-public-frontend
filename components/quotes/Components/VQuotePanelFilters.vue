<template>
  <!-- Modal - Filtro Fornecedores -->
  <vs-popup title="Filtrar fornecedores" :active.sync="open">
    <span class="d-block font-weight-normal font-small-3 mb-2">Mostrar apenas fornecedores com...</span>

    <vs-tabs
      v-if="quoteCategories"
      vs-model="tab"
      position="left"
    >
      <span
        :key="index"
        v-for="(categories, family, index) in quoteCategories"
        :id="'tab' + index"
      >
        <vs-tab :label="family">
          <div>
            <ul class="list-unstyled mb-0">
              <li
                class="d-flex justify-content-between align-items-center py-25"
                v-for="(productTypes, category) in categories"
                :key="category"
              >
                <vs-checkbox v-model="selectedCategories" :vs-value="JSON.parse(category)[1]">{{ JSON.parse(category)[0] }}</vs-checkbox>
              </li>
            </ul>
          </div>
        </vs-tab>
      </span>
    </vs-tabs>




    <span class="float-left mt-50 font-small-3">{{ selectedCategories.length }} categorias selecionadas</span>
    <div class="row m-0 pt-1 d-flex float-right">
      <vs-button @click="clearCategories()" color="primary" type="flat">Limpar filtros</vs-button>
      <vs-button id="apply-filter" @click="filterQuotations()" color="primary" type="filled" class="ml-1" style="width: 60px">
        <b-spinner v-if="buttonLoading" small />
        <span v-else>Filtrar</span> 
      </vs-button>
    </div>
  </vs-popup>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      selectedCategories: [],
      tab: null,
      open: false,
      buttonLoading: false
    }
  },
  mounted() {
    this.getQuoteCategories(this.quote.id)
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("quotes", ["quotes", "quoteCategories", "filteredQuotations"]),
  },
  methods: {
    ...mapActions("quotes", [
      'getQuoteCategories',
      'filterByCategories',
      'clearFilteredQuotations'
    ]),
    filterQuotations() {
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.filterByCategories({ quoteId: this.quote.id,
                                  categories: this.selectedCategories })
        this.open = false
      }, 300);
    },
    clearCategories() {
      this.selectedCategories = []
      this.clearFilteredQuotations()
      this.open = false
    }
  },
  watch: {
    quote() {
      this.getQuoteCategories(this.quote.id)
    },
    popupActive() {
      this.open = this.popupActive
    },
    open(newValue) {
      this.$emit('update-popup', newValue)
    }
  },
  props: {
    quote: {
      type: Object,
      required: true
    },
    popupActive: {
      type: Boolean,
      required: true
    }
  },
};
</script>
