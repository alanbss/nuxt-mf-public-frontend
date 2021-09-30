<template>
  <div class="content-wrapper">
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
        <div class="p-2" style="margin: -2.35rem -2.20rem 1.50rem -2.20rem; background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
            <div class="px-75">
                <div class="float-right font-small-3">
                  <VDropdownInfo :supplier="supplier" v-if="supplier" />
                  <!-- <button
                    @click="leaveReview()"
                    type="button"
                    class="btn btn-primary text-bold-600 waves-effect waves-light"
                    style="margin-top: -0.75rem; margin-left: 20px;"
                    >
                    Sair da revisão
                  </button> -->
                </div>
                <h6 class="m-0 font-weight-bold">{{ quotation.supplierName }}</h6>
            </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="card shadow-sm bg-rgba-warning">
              <div class="card-body justify-content-start">
                <div class="avatar bg-rgba-light p-50 m-0 mr-2 mb-50 mb-md-0 float-left" style="cursor: default;">
                  <div class="avatar-content">
                      <i class="feather icon-info text-body font-medium-5"></i>
                  </div>
                </div>
                <div class="ml-2">
                  <h4 class="card-title color-mf-laranja">
                    Revise antes de emitir o pedido
                  </h4>
                  <p class="mb-1">
                    Estes são os produtos que você selecionou
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <VQuotationProductsReview
          v-if="loadedQuotation && quotationProducts && updated"
          :quotation="loadedQuotation"
          :products="quotationProducts"
        />

        <div class="col-12">
          <vs-pagination :total="totalPages" v-model="currentPage" :max="10" :color="'#7367F0'" />
        </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import priceFormatter from "@/mixins/priceFormatter";
import VQuotationProductsReview from "@/resources/quotations/Components/VQuotationProductsReview";
import VDropdownInfo from "@/resources/suppliers/components/VDropdownInfo";

export default {
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
      quotationId: undefined,
      loadedQuotation: undefined,
      updated: false,
    };
  },

  created() {
    this.isLoading = true
    this.quotationId = this.$route.params.quotationId
    this.clearPagination()
    this.getQuotationWithPayments({ id: this.quotationId }).then(() => {
      this.loadedQuotation = this.quotation
      this.getSupplierById(this.quotation.supplierId)
      this.getValidQuotationProductsByPageNumber({ id: this.quotationId }).then(() => {
        this.updated = true
        this.isLoading = false
      })
    })

  },

  mounted() {
    this.$root.$on('back-to-review-order', () => {
      this.leaveReview()
    })
  },

  watch: {
    currentPage(pageNumber) {
      this.userSelectedPage(pageNumber)
      this.updated = false
      this.getValidQuotationProductsByPageNumber({ id: this.quotationId }).then(() => {
        this.updated = true
      })
    },
  },

  computed: {
    ...mapState("quotations", ["quotation", "quotationProducts"]),
    ...mapState("quotes", ["quotes"]),
    ...mapState("pagination", ["totalPages", "totalCount"]),
    ...mapState("suppliers", ["supplier"]),
    currentPage: {
      get() {
        return this.$store.state.pagination.currentPage
      },
      set(value) {
        this.$store.dispatch("pagination/setCurrentPage", value)
      },
    },
  },

  methods: {
    ...mapActions("quotations", [
      "getQuotationWithPayments",
      "getValidQuotationProductsByPageNumber",
      "getTotal",
      "savePaymentMethod"
    ]),
    ...mapActions("pagination", ["userSelectedPage", "clearPagination"]),
    ...mapActions("suppliers", ["getSupplierById"]),
    leaveReview() {
      this.$router.push({ name: 'users.reviewQuotation', params: { quotationId: this.quotationId }})
    }
  },
  components: {
    VQuotationProductsReview,
    VDropdownInfo
  },
  mixins: [priceFormatter]
};
</script>
