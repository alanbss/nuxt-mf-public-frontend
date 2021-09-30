<template>
  <!-- Modal - Filtro Fornecedores -->
  <vs-popup :title="product.productTypeName" :active.sync="open">
    <div class="row m-0">
      <div class="col-md-5 col-12 m-0">
        <img v-if="product.picture" class="rounded img-fluid" width="200" :src="product.picture" alt  />
        <img v-else class="rounded img-fluid" width="200" :src="noImageSrc" alt />
      </div>
      <div class="col-md-7 col-12 m-0">
        <p class="font-small-3">
          <span v-if="product.brandName">{{ product.brandName }}</span>
          <span v-else>(marca não def.)</span>
          <span v-if="product.productLineName"> / {{ product.productLineName }}</span>
          <span v-if="product.productLineExtensionName"> / {{ product.productLineExtensionName }}</span>
        </p>
        <p class="font-small-3" v-if="product.propertyName"><b>{{ product.propertyName }}</b></p>
        <p class="m-0">
          <small class="text-tiny">{{quantifiers()}}</small>
        </p>
        <p v-html="secondaryCharacteristicsAsText"></p>
        <!-- <p class="font-small-3 mt-1" style="color: grey;" v-if="product.comments">{{ product.comments }}</p> -->
      </div>

    </div>
    <div class="row m-0" v-if="showCartButtons">
      <div class="col-md-5 col-12 m-0">
      </div>
      <div class="col-md-7 col-12 m-0">
        <div class="p-0 position-relative">
          <div class="py-1 bg-transparent rounded-bottom">
            <a
              data-toggle="collapse"
              href="javascript:void(0)"
              aria-expanded="false"
              :aria-controls="'collapseCotacaoCardModal-' + product.id"
              @click="addToCart(product.id)"
              class="card-link font-weight-bold d-block collapsed"
              :ref="'addProduct' + product.id"
            >
              Adicionar à cotação
            </a>
          </div>
          <div
            :class="buttonClass(product.id)"
            :id="'collapseCotacaoCardModal-' + product.id"
            style="top: 0px;"
          >
            <span class="py-1 text-center float-left w-75 font-weight-bold d-block text-white">Adicionado</span>
            <a
              href="javascript:void(0)"
              data-toggle="collapse"
              aria-expanded="false"
              :aria-controls="'#collapseCotacaoCardModal-' + product.id"
              title="Remover da cotação"
              class="text-center float-right bg-white d-block w-25 text-body collapsed"
              style="border-bottom-right-radius: 0.4rem; padding: 0.9rem 0;"
              @click="removeFromCart(product.id)"
            >
              <i class="feather icon-x font-medium-3"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <vs-row vs-type="flex" vs-justify="flex-end" v-if="catalogPublic">
      <vs-divider/>
      <vs-button
        class="float-right"
        color="primary"
        type="filled"
        style=""
      >
        Cotar este e outros produtos
      </vs-button>
    </vs-row>
    <vs-row vs-type="flex" vs-justify="flex-end" v-if="catalogPublic" style="margin-top: 3px;">
      Você será encaminhado para o sistema
    </vs-row>
  </vs-popup>
</template>

<script>
import { mapGetters } from "vuex";
import cardTitle from "@/resources/products/mixins/cardTitle";

export default {
  name: "ProductInfoModal",
  data() {
    return {
      open: false,
      secondary: [],
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`)
    }
  },
  created() {
    this.secondary = [...this.product.secondaryCharacteristics]
    //this.secondary.sort()
  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open(newVal) {
      this.$emit('update-modal', newVal)
    }
  },
  computed: {
    ...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    secondaryCharacteristicsAsText() {
      return '<p class="mt-1"><small class="text-tiny">' + this.secondary.join("<br>") + '</small></p>'
    },
  },
  methods: {
    goToCover() {
      this.$router.push({ name: 'cover', query: { originSupplier: this.supplierUserName, originCatalog: true } })
    },
    buttonClass(id) {
      if(!this.productCartIsEmpty && this.productIsOnCart(id))
        return "position-absolute w-100 rounded-bottom bg-primary collapse show"
      else
        return "position-absolute w-100 rounded-bottom bg-primary collapse"
    },
    removeFromCart(id) {
      this.$emit('remove-from-cart-event')
      this.open = false
    },
    addToCart(id) {
      this.$emit('add-to-cart-event')
      this.open = false
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    openPopup: {
      type: Boolean,
      required: true,
    },
    catalogPublic: {
      type: Boolean
    },
    supplierUserName: {
      type: String
    },
    showCartButtons: {
      type: Boolean
    },
  },
  components: {

  },
  mixins: [cardTitle]
};
</script>
