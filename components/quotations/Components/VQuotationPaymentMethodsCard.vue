<template>
  <div :class="(blockPayments || justMin) ? 'card shadow-sm pb-1' : 'card shadow-sm h-100' ">
      <div class="card-body pb-0">
          <h4 class="card-title"><i class="feather icon-dollar-sign font-medium-2 mr-50"></i> Condições financeiras</h4>
          <div class="mt-2">
              <strong>Valor MÍNIMO*</strong>
              <a href="javascript:void(0);" @click="emitEditMinimum" class="ml-50">Editar</a>
              <span class="d-block font-small-3 mt-25" v-if="configuration.minimumOrderValue">
                R$ {{ configuration.minimumOrderValue.replace('.', ',') }}
              </span>
          </div>
          <div class="mt-2" >
            Valor MÁXIMO de pedido <strong style="color: #d11b6d;">para este cliente.</strong>
            <b-tooltip
              ref="tooltip"
              :show.sync="show"
              triggers="change"
              target="text-maximum-value"
            >
              <span>O valor máximo precisa ser maior que o mínimo.</span>
            </b-tooltip>
            <input
              v-model="maximum"
              v-currency="{currency: 'BRL', locale: 'pt-br'}"
              @change="setPaymentInfo(paymentInfoObject); enableTooltip()"
              type="text"
              class="form-control mt-25"
              style="width: 120px;"
              id="text-maximum-value"
              placeholder="0,00">
              <p class="font-small-2">
                Se não quiser definir um máximo, então deixar este campo em branco
              </p>
          </div>
          <div class="mt-2" v-if="!blockPayments && !justMin">
              <strong>Condições pgt oferecidas*</strong>
              <a href="#" class="ml-50">Editar</a>
              <b-alert class='justify-background-alert' variant="warning" show>
                <p class="alert-body font-weight-bold">
                  O cliente não paga através do Meu Fornecedor, isto é direto com você. Estas opções servem para agilizar a comunicação entre vocês.
                </p>
              </b-alert>
                <div
                  class="vs-checkbox-con vs-checkbox-primary mt-1"
                  v-for="method in paymentMethods"
                  :key="method.id"
                >
                    <input
                      @change="setPaymentInfo(paymentInfoObject)"
                      type="checkbox"
                      :value="method.id"
                      v-model="methods"
                    >
                    <span class="vs-checkbox">
                      <span class="vs-checkbox--check">
                        <i class="vs-icon feather icon-check"></i>
                      </span>
                    </span>
                    <span>{{ method.paymentMethod }}</span>
                </div>
          </div>
      </div>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex"

export default {
  data() {
    return {
      minimum: undefined,
      maximum: (parseFloat(this.configuration.lastMaximumOrderValue).toFixed(2)).toString().replace('.', ','),
      show: false,
      methods: []
    }
  },
  mounted() {
    if(this.configuration.lastPaymentMethods) {
      this.methods = JSON.parse(this.configuration.lastPaymentMethods)
      this.setPaymentInfo(this.paymentInfoObject)
    }
    if(this.configuration.lastMaximumOrderValue){
      this.maximum = (parseFloat(this.configuration.lastMaximumOrderValue).toFixed(2)).toString().replace('.', ',')
      }else{
        this.maximum = undefined
      }
    if(this.paymentInfo &&
      (this.paymentInfo.payment_methods && this.paymentInfo.payment_methods.length))
      this.methods = this.paymentInfo.payment_methods
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("quotations", ["paymentInfo"]),
    paymentInfoObject() {
      return { maximum_order_value: this.maximum, payment_methods: this.methods }
    }
  },
  methods: {
    ...mapActions("quotations", [
      "setPaymentInfo"
    ]),
    enableTooltip(){
        if(parseFloat(this.maximum.replace(',', '.')).toFixed(2) < parseFloat(this.configuration.minimumOrderValue).toFixed(2))
          this.show = true
        else
          this.show = false
    },
    emitEditMinimum() {
      this.$emit('clicked-edit')
      this.$router.push({ name: 'minimum-order-value' })
    }
  },
  props: {
    paymentMethods: {
      type: Array,
      required: true
    },
    configuration: {
      type: Object,
      required: true
    },
    blockPayments: {
      type: Boolean
    },
    justMin: {
      type: Boolean
    },
  },
};
</script>
