<template>
  <span>
    <vs-popup title="" :active.sync="open" class="p-0 m-0" style="overflow: hidden;">
      <div class="row m-0 pb-2">
        <div class="col-3 m-0 p-0 text-center">
          <img v-if="supplier.picture" :src="supplier.picture" alt="*" width="auto" height="45">
          <img v-else :src="require(`~/assets/images/avatar-default.png`)" alt="*" width="auto" height="45">
        </div>
        <div class="col-9 m-0 p-0">
          <h3 class="m-0 font-weight-bold">{{ supplier.user.name }}</h3>
          <a :href="'tel:' + supplier.user.phone">
            {{ supplier.user.phone }}
          </a>
          <br>
          <vs-button @click="shareOnWhatsapp()" class="font-medium-1" color="#25D366" type="border" style="padding: 7px 10px; margin-top: 2px;">
            <i class="fa fa-whatsapp mr-50"></i>Conversar
          </vs-button>
        </div>
      </div>
      <div class="row m-0 pb-2">
        <div class="col-12">
          <span class="badge badge-pill badge-secondary font-small-3" v-if="supplier.minimumOrderValue">
            Min. {{ supplier.minimumOrderValue }}
          </span>
        </div>
        <div class="col-12">
          <span class="badge badge-pill badge-secondary font-small-3" v-if="!supplier.deliveryEstimate">
            Não faz entrega
          </span>
        </div>
        <div class="col-6 mt-1 mb-1">
          <div v-if="supplier.deliveryEstimate">
            <h6>Prazo padrão</h6>
            {{ supplier.deliveryEstimate }}
          </div>
        </div>
        <div class="col-6 mt-1 mb-1">
          <div v-if="supplier.deliveryRoute">
            <h6>Rota</h6>
            {{ supplier.deliveryRoute }}
          </div>
        </div>
        <div class="col-12">
          {{ supplier.user.name }}<br>
          CNPJ {{ supplier.user.cnpj }}<br>
          {{ supplier.user.street }}, {{ supplier.user.addressDetails }}<br>
          {{ supplier.user.neighborhood }} - {{ supplier.user.city }} / {{ supplier.user.stateUf }}<br>
          {{ supplier.user.zipcode }}
        </div>
      </div>
      <div class="row m-0">
        <div class="col-12 d-flex justify-content-center">
          <vs-button @click="open = false" type="filled" color="primary" style="width: 130px;">Fechar</vs-button>
        </div>
      </div>
    </vs-popup>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SupplierInfoModal",
  data() {
    return {
      open: false,
      comments: null
    }
  },
  created() {

  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-popup', this.open)
    }
  },
  computed: {

  },
  methods: {
    shareOnWhatsapp() {
      var url = "https://api.whatsapp.com/send?text=" +
                'Ol%C3%A1!%20Peguei%20seu%20contato%20pela%20plataforma%20Meu%20Fornecedor.%0AEst%C3%A1%20podendo%20falar%20agora%3F' +
                '&phone=55' + this.supplier.user.phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')
      window.open(url, '_blank')
    },
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    supplier: {
      type: Object,
      required: true,
    },
  },
  components: {

  },
};
</script>
