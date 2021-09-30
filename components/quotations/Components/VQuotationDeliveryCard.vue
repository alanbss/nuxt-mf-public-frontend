<template>
  <div class="card h-100 shadow-sm">
      <div class="card-body pb-0">
          <h4 class="card-title"><i class="feather icon-truck font-medium-2 mr-50"></i> Condições de entrega</h4>
          <div class="mt-2">
              <strong v-if="configuration.deliveryEstimate ==''" >Não realizamos entregas.</strong>
              <strong v-else >Prazo padrão</strong>
              <a href="javascript:void(0);" @click="emitEdit" class="ml-50">Editar</a>
              <span class="d-block font-small-3 mt-25">
                {{ configuration.deliveryEstimate }}
              </span>
          </div>
          <div v-if="configuration.deliveryEstimate != ''" git class="mt-2">
              <strong>Rota / Intinerário</strong>
              <a href="javascript:void(0);" @click="emitEdit" class="ml-50">Editar</a>
              <span class="d-block font-small-3 mt-25">
                {{ configuration.deliveryRoute }}
              </span>
          </div>
          <div v-if="configuration.deliveryEstimate != ''" class="mt-2">
              <strong>Taxa e obs. frete</strong>
              <textarea
                @change="setDeliveryInfo(deliveryInfoObject)"
                v-model="rate"
                class="form-control mt-25"
                id=""
                rows="3"
              >
              </textarea>
          </div>
      </div>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      rate: undefined
    }
  },
  mounted() {
    if(this.configuration.lastDeliveryRate)
      this.rate = this.configuration.lastDeliveryRate
  },
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("quotations", ["deliveryInfo"]),
    deliveryInfoObject() {
      return { delivery_rate: this.rate }
    }
  },
  methods: {
    ...mapActions("quotations", [
      "setDeliveryInfo"
    ]),
    emitEdit() {
      this.$emit('clicked-edit')
      this.$router.push({ name: 'delivery-conditions' })
    },
  },
  props: {
    configuration: {
      type: Object,
      required: true
    },
  },
};
</script>
