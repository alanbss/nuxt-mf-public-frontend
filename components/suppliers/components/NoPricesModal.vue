<template>
  <span>
    <vs-popup title="Produtos sem preço" :active.sync="open">
      <div class="row m-0 pb-2 d-flex justify-content-center">
        <i class="feather icon-info text-danger" style="font-size: 7em;"></i>
      </div>
      <div class="row m-0 pl-1 pr-1 pb-1 d-flex justify-content-center">
        <h4>{{ noPriceCount }} produtos estão sem preço</h4>
      </div>
      <div class="row m-0 pl-1 pr-1 pb-1 d-flex justify-content-center">
        <h5 class="text-center">
          PRODUTOS SEM PREÇO NÃO APARECEM NO SEU CATÁLOGO.<br>
          Os clientes perdem acesso a estes produtos.
        </h5>
      </div>
      <div class="row m-0 pl-1 pr-1 pb-1 d-flex justify-content-center">
        <h6 class="text-center" style="font-weight: normal;">
          Quais estão sem preço?<br>
          Há um número ao lado dos produtos, no menu à esquerda, indicando quantos faltam para precificação.
        </h6>
        <p class="text-center">
          Obs. Marque 'Está indisponível' para produtos sem estoque. Para estes, o preço não é necessário.<br>
        </p>
      </div>
      <div class="row m-0 pb-1 d-flex justify-content-center">
        <span v-if="justOneButton">
          <vs-button @click="updateAndClose" color="primary" type="filled">Salvar e continuar</vs-button>
        </span>
        <span v-else>
          <vs-button @click="goToRoute" class="mr-2" color="primary" type="border">Salvar e sair</vs-button>
          <vs-button @click="updateAndClose" color="primary" type="filled">Salvar e ficar</vs-button>
        </span>
      </div>
    </vs-popup>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "NoPricesModal",
  data() {
    return {
      open: false,
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

  },
  methods: {
    ...mapActions("suppliers", [
      "getNoPriceData",
    ]),
    goToRoute() {
      this.$emit('update-popup', false)
      if(this.routeName != 'home')
        this.$router.push({ name: this.routeName })
      else
        this.$emit('run-logout')
    },
    updateAndClose() {
      this.open = false
      this.getNoPriceData()
      this.$emit('clicked-stay')
    }
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    noPriceCount: {
      type: Number,
      required: true,
    },
    routeName: {
      type: String,
      required: true
    },
    justOneButton: {
      type: Boolean
    }
  },
  components: {

  },
};
</script>
