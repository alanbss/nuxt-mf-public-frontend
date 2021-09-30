<template>
  <div>
    <div class="px-2 py-1 clearfix" style="background: #EDEDED; border-bottom: solid 1px #D5D5D5; border-left: solid 1px #D5D5D5;">
      <div class="float-right">
        <vs-dropdown>
          <a class="a-icon" href="#">
            <i class="feather icon-more-vertical"></i>
          </a>

          <vs-dropdown-menu>
            <vs-dropdown-item style="color: black;" @click="openPopup('info')">CNPJ e End.</vs-dropdown-item>
            <vs-dropdown-item style="color: black;" @click="openPopup('contact')">Contato</vs-dropdown-item>
            <vs-dropdown-item style="color: black;" @click="openPopup('payment')">Cond. Financeira</vs-dropdown-item>
            <vs-dropdown-item style="color: black;" @click="openPopup('delivery')">Cond. Entrega</vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>

      </div>
      <a v-if="isMobile" href="javascript:void(0);" @click="emitBackbutton()" title="Voltar" class="d-md-none">
        <i class="feather icon-arrow-left mr-1 mt-n25 float-left font-large-1"></i>
      </a>
      <h6 class="m-0 font-weight-bold" style="padding-top: 3px;" v-if="quotation.supplierName">{{ quotation.supplierName }}</h6>
      <h6 class="m-0 font-weight-bold" style="padding-top: 3px;" v-else-if="quotation.supplier && quotation.supplier.name">{{ quotation.supplier.name }}</h6>
    </div>

    <div v-if="openQuotation">
      <vs-popup title="Financeiro" :active.sync="openPayment">
        <div class="row w-100">
          <div class="col-md-6 col-12">
            <h5 class="mb-50 mt-1">Valor mínimo de pedido</h5>
            <p>{{ formatPrice(quotation.minimumOrderValue) }}</p>
          </div>
          <div class="col-md-6 col-12">
            <h5 class="mb-50 mt-1" v-if="quotation.maximumOrderValue">Valor máximo de pedido</h5>
            <p v-if="quotation.maximumOrderValue">{{ formatPrice(quotation.maximumOrderValue) }}</p>
          </div>
          <!-- <div class="col-12">
              <hr>
              <h5 class="mb-50 pt-1">Condições de pagamento oferecidas</h5>
              <div class="font-small-3" v-for="payment in quotation.paymentMethods" :key="payment.paymentMethod">
                {{ payment.paymentMethod }}
              </div>
          </div> -->
        </div>
      </vs-popup>
      <vs-popup title="Condições de entrega" :active.sync="openDelivery">
        <div v-if="quotation.deliveryEstimate">
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
        </div>
        <div v-else>
          <h5 class="mb-50 pt-1">Este Fornecedor não realiza entregas.</h5>
        </div>
      </vs-popup>
      <vs-popup title="Contato do fornecedor" :active.sync="openContact">
        <form action="#">
          <div class="modal-body">
            <div class="table-responsive">
              <table class="table mb-0">
                  <tbody>
                    <tr>
                      <th scope="row"><i class="feather icon-phone mr-25"></i> Telefone:</th>
                      <td><a href="">{{ supplier.user.phone }}</a></td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </div>
        </form>
      </vs-popup>
      <vs-popup title="Dados do fornecedor" :active.sync="openInfo">
        <div class="table-responsive">
          <table class="table mb-0">
              <tbody>
                  <tr>
                    <th scope="row">Nome fantasia:</th>
                    <td>{{ supplier.user.name }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Razão social:</th>
                    <td>{{ supplier.user.legalName }}</td>
                  </tr>
                  <tr>
                    <th scope="row">CNPJ:</th>
                    <td>{{ supplier.user.cnpj }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Endereço:</th>
                    <td>
                      {{ supplier.user.street }}, {{ supplier.user.addressDetails }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Bairro:</th>
                    <td>{{ supplier.user.neighborhood }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Município/UF:</th>
                    <td>{{ supplier.user.city }} / {{ supplier.user.stateUf }}</td>
                  </tr>
              </tbody>
          </table>
        </div>
      </vs-popup>
    </div>
  </div>
</template>

<script>
import priceFormatter from "@/mixins/priceFormatter";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      openPayment: false,
      openDelivery: false,
      openInfo: false,
      openContact: false
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
      else if(popup == 'info')
        this.openInfo = true
      else if(popup == 'contact')
        this.openContact = true
      else
        this.openPayment = true
    },
    emitBackbutton() {
      this.$emit('back-button')
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
    isMobile: {
      type: Boolean
    },
  },
  components: {

  },
  mixins: [priceFormatter]
};
</script>
