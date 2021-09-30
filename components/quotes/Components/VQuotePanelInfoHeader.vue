<template>
  <div class="p-2" style="background: #EDEDED; border-bottom: solid 1px #D5D5D5">
    <div class="float-right font-small-3">
      <vs-dropdown>
        <a class="a-icon" href="#">
          <i class="feather icon-phone"></i><span class="d-md-inline d-none ml-25">Contato</span>
        </a>

        <vs-dropdown-menu>
          <!-- <vs-dropdown-item><i class="fa fa-whatsapp mr-25"></i> WhatsApp</vs-dropdown-item> -->
          <vs-dropdown-item style="color: black;"><i class="feather icon-phone mr-25"></i> {{ this.supplier.user.phone }}</vs-dropdown-item>
        </vs-dropdown-menu>
      </vs-dropdown>

      <VDropdownInfo :supplier="supplier" />

      <span v-if="openQuotation">
        <a href="javascript:void(0)" @click="openPopup('payment')" class="ml-2"><i class="feather icon-dollar-sign"></i><span class="d-md-inline d-none ml-25">Pagamento</span></a>
        <a href="javascript:void(0)" @click="openPopup('delivery')" class="ml-2"><i class="feather icon-truck"></i><span class="d-md-inline d-none ml-25"> Entrega</span></a>
      </span>
    </div>
  <a @click="backToQuotes()" title="Voltar" class="d-md-none"><i class="feather icon-arrow-left mr-1 mt-n25 float-left font-large-1"></i></a>
  <h6 class="m-0 font-weight-bold">{{ quotation.supplierName }}</h6>
  <div v-if="openQuotation">
    <vs-popup title="Financeiro" :active.sync="openPayment">
      <div class="row w-100">
        <div class="col-md-6 col-12">
            <h5 class="mb-50 mt-1">Valor mínimo de pedido</h5>
            <p>{{ formatPrice(quotation.minimumOrderValue) }}</p>
        </div>
        <div class="col-md-6 col-12">
            <h5 class="mb-50 mt-1">Valor máximo de pedido</h5>
            <p>{{ formatPrice(quotation.maximumOrderValue) }}</p>
        </div>
        <div class="col-12">
            <hr>
            <h5 class="mb-50 pt-1">Condições de pagamento oferecidas</h5>
            <div class="font-small-3" v-for="payment in quotation.paymentMethods" :key="payment.paymentMethod">
              {{ payment.paymentMethod }}
            </div>
        </div>
      </div>
    </vs-popup>
    <vs-popup title="Condições de entrega" :active.sync="openDelivery">
      <h5 class="mb-50 pt-1">Prazo de entrega</h5>
      <p class="font-small-3">
        {{ quotation.deliveryEstimate }}
      </p>

      <h5 class="mb-50 pt-1">Rota</h5>
      <p class="font-small-3">
        {{ quotation.deliveryRoute }}
      </p>

      <h5 class="mb-50 pt-1">Custo de frete</h5>
      <p class="font-small-3">
        {{ quotation.deliveryRate }}
      </p>
    </vs-popup>
  </div>
</div>
</template>

<script>
import priceFormatter from "@/mixins/priceFormatter";
import VDropdownInfo from "~/components/suppliers/components/VDropdownInfo";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      openPayment: false,
      openDelivery: false,
    }
  },
  mounted() {

  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("quotations", [
      "quotationCategories",
      "quotationProducts"
    ]),
    ...mapState("quotations/quotationPrices", [
      "quotationPrices"
    ]),
  },
  created() {

  },
  methods: {
    ...mapActions("quotations", [
      "getQuotationCategories",
      "getQuotationProductsByCategory",
      "saveExpeditionQuantities"
    ]),
    ...mapActions("quotations/quotationPrices", [
      "getPricesByQuotation"
    ]),
    openPopup(popup) {
      if(popup == 'delivery')
        this.openDelivery = true
      else
        this.openPayment = true
    },
    backToQuotes(){
      this.$emit('back-button', 'menu')
    }
  },
  props: {
    supplier: {
      type: Object,
      required: true
    },
    quotation: {
      type: Object,
      required: true
    },
    openQuotation: {
      type: Boolean,
      required: true
    },
  },
  components: {
    VDropdownInfo,
  },
  mixins: [priceFormatter]
};
</script>
