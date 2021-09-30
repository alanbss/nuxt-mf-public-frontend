<template>
  <span>
    <vs-popup title="" :active.sync="open" class="p-0">
      <div class="row m-0 pb-1">
        <div class="col-12">
          <div>
            <h6>Qual o motivo do cancelamento?</h6>
            <textarea
              v-model="justification"
              class="form-control mt-25"
              id=""
              rows="2"
            >
            </textarea>
          </div>
        </div>
      </div>
      <div class="row p-1 d-flex justify-content-between" style="background: #0391D1; margin-bottom: -0.93rem; margin-left: -0.9rem; margin-right: -0.95rem; overflow: hidden; border-radius: 0 0 6px 6px;">
        <vs-button @click="open = false" type="line" color="#FFFFFF" style="padding-bottom: 2px;">Voltar</vs-button>

        <vs-tooltip-custom text="Justifique ao cliente porque você recusou o pedido de compra." :active="isDisabled">
          <button @click="refuse(quotationId)"
          type="button"
          class="btn text-bold-600 mr-1"
          style="background-color: #d11b6d; color: white;"
          :disabled="isDisabled"
        >
          Recusar o pedido
        </button>
        </vs-tooltip-custom>
      </div>
    </vs-popup>
  </span>
</template>

<script>
import { mapActions } from "vuex";
import VsTooltipCustom from "~/components/tooltip/VSTooltipCustom";
import VSTooltipCustom from '../../../components/tooltip/VSTooltipCustom.vue';


export default {
  name: "RefuseQuotationModal",
  data() {
    return {
      open: false,
      justification: null,
    }
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
      if(this.justification)
        return false
      else
        return true
    }
  },
  methods: {
    ...mapActions("quotations", [
      "refuseOrder",
    ]),
    ...mapActions("orders", [
      "refuseDirectOrder",
    ]),
    refuse() {
      if(this.quotation.orderType && this.quotation.orderType == 'Direta') {
        this.refuseDirectOrder({ orderId: this.quotationId, justification: this.justification }).then(() => {
          this.$emit('supplier-refused-order', this.quotationId)
          this.open = false
        })
      } else {
        this.refuseOrder({ quotationId: this.quotationId, justification: this.justification }).then(() => {
          this.$emit('supplier-refused-order', this.quotationId)
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
  },
  components: {
    VsTooltipCustom,
  },
};
</script>
