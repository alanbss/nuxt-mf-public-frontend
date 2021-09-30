<template>
  <span>
    <vs-popup title="Condições de entrega" :active.sync="open" class="p-0">
      <div class="row m-0 pb-2">
        <div v-if="configuration.deliveryEstimate" class="col-6">
          <h6>Prazo padrão</h6>
          {{ configuration.deliveryEstimate }}
        </div>
        <div v-else class="col-6">
          <h6>Não realizamos entregas.</h6>
        </div>
        <div v-if="configuration.deliveryRoute" class="col-6">
          <h6>Rota</h6>
          {{ configuration.deliveryRoute }}
        </div>
      </div>
      <div class="row m-0 pb-1" v-if="configuration.lastDeliveryRate">
        <div class="col-12">
          <span v-if="configuration.deliveryEstimate" class="d-block w-100">
            <h6>Taxa e obs. frete</h6>
            {{ configuration.lastDeliveryRate }}
          </span>
        </div>
      </div>
      <div class="row m-0 pb-1">
        <div class="col-12">
          <div class="mt-2">
            <h6>Adicionar um recado para o cliente? (opcional)</h6>
            <textarea
              v-model="comments"
              class="form-control mt-25"
              id=""
              rows="2"
              placeholder="Por exemplo, 'Sua entrega sairá amanhã pela manhã' "
            >
            </textarea>
          </div>
        </div>
      </div>
      <div class="row p-1 d-flex justify-content-between" style="background: #0391D1; margin-bottom: -0.93rem; margin-left: -0.9rem; margin-right: -0.95rem; overflow: hidden; border-radius: 0 0 6px 6px;">
        <vs-button @click="open = false" type="line" color="#FFFFFF" style="padding-bottom: 2px;">Voltar</vs-button>
        <button @click="accept(quotation.id)"
          type="button"
          class="btn text-bold-600 mr-1"
          style="background-color: #FFFF00;"
        >
          Confirmar o pedido
        </button>
      </div>
    </vs-popup>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RefuseQuotationModal",
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
    isDisabled() {
      if(this.justification.length)
        return false
      else
        return true
    }
  },
  methods: {
    ...mapActions("quotations", [
      "acceptOrder",
    ]),
    ...mapActions("orders", [
      "acceptDirectOrder",
    ]),
    accept() {
      if(this.quotation.orderType && this.quotation.orderType == 'Direta') {
        this.acceptDirectOrder({ orderId: this.quotationId, comments: this.comments }).then(() => {
          this.$emit('supplier-accepted-order', this.quotationId)
          this.open = false
        })
      } else {
        this.acceptOrder({ quotationId: this.quotationId, comments: this.comments }).then(() => {
          this.$emit('supplier-accepted-order', this.quotationId)
          this.open = false
        })
      }
    },
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    quotationId: {
      type: Number,
      required: true,
    },
    quotation: {
      type: Object,
      required: true
    },
    configuration: {
      type: Object,
      required: true
    }
  },
  components: {

  },
};
</script>
