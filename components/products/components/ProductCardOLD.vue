<template>
  <div :class="classes">
    <h4 v-if="!isProductTypeView && !blockProductTypeTitle" class="font-medium-2 overflow-hidden" style="height: 22px">
      <router-link
        :to="{ name: 'product-type', params: { productTypeId: product.productTypeId }}"
      >{{product.productTypeName}}</router-link>
    </h4>
    <div class="card font-small-3 mb-0" style="height: auto;">
      <div class="card-body p-0 position-relative">
        <a href="javascript:void(0);" @click="openInfoPopup">
          <v-product-card-title :product="product" />

          <div class="card-text p-1 pb-1 clearfix">
            <div class="mr-75 float-left position-relative" style="width: 43%; height: 100%;">
              <i
                class="feather icon-search position-absolute font-weight-bold text-muted"
                style="left: 3px; bottom: 3px; "
              ></i>
              <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: auto; height: auto;" />
              <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: auto; height: auto;" />
            </div>
            <div style="min-height: 70px;">
              <v-secondary-characteristics :product="product" :showComments="true" />
            </div>
          </div>
        </a>
      </div>
      <div class="card-footer clearfix p-0 bg-white text-center position-relative">
        <div class="py-1 bg-white rounded-bottom">
          <a
            data-toggle="collapse"
            href="javascript:void(0)"
            aria-expanded="false"
            :aria-controls="'collapseCotacaoCard-' + product.id"
            @click="addToCart(product.id)"
            class="card-link font-weight-bold d-block collapsed"
            :ref="'addProduct' + product.id"
            v-if="!adding"
          >
            Adicionar à cotação
          </a>
          <span v-show="adding">
            <div :id="'div-with-loading' + this.product.id" class="vs-con-loading__container">
              Adicionando...
            </div>
          </span>
        </div>
        <div
          :class="buttonClass(product.id)"
          :id="'collapseCotacaoCard-' + product.id"
          style="top: 0px;"
        >
          <span v-if="!removing" class="py-1 float-left w-75 font-weight-bold d-block text-white">Adicionado</span>
          <span v-else class="py-1 float-left w-75 font-weight-bold d-block text-white">
            <div :id="'div-with-loading' + this.product.id" class="vs-con-loading__container">
              Removendo...
            </div>
          </span>
          <a
            href="javascript:void(0)"
            data-toggle="collapse"
            aria-expanded="false"
            :aria-controls="'#collapseCotacaoCard-' + product.id"
            title="Remover da cotação"
            class="float-right bg-white d-block w-25 text-body collapsed"
            style="border-bottom-right-radius: 0.4rem; padding: 0.9rem 0;"
            @click="removeFromCart(product.id)"
          >
            <i class="feather icon-x font-medium-3"></i>
          </a>
        </div>
      </div>
    </div>
    <product-info-modal :openPopup="openPopup" :product="product" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import VProductCardTitle from "~/components/products/components/VProductCardTitle";
import VSecondaryCharacteristics from "~/components/products/components/VSecondaryCharacteristics";
import ProductInfoModal from "~/components/products/components/ProductInfoModal";

export default {
  name: "ProductCard",
  data() {
    return {
      openPopup: false,
      adding: false,
      removing: false,
      noImageSrc: require(`~/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`)
    }
  },
  computed: {
    ...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    classes() {
      if (this.isProductTypeView) {
        return "col-xl-2 col-md-4 col-6 mb-5";
      }

      if (this.isCategoryView || this.isFamilyView || this.isSearchView) {
        return "col-xl-3 col-md-4 col-6 mb-5";
      }

      return this.$route.name === "my-product-list"
        ? "col-xl-3 col-md-4 col-6 mb-3"
        : "col-xl-2 col-md-4 col-6 mb-3";
    },
    isProductTypeView() {
      return this.$route.name === "product-type";
    },
    isCategoryView() {
      return this.$route.name === "category";
    },
    isSearchView() {
      return this.$route.name === "users.search";
    },
    isFamilyView() {
      return this.$route.name === "family";
    },
    addedInfo() {
      var total = this.$store.state.users.products.productQuoteCart.length + 1
      if (this.$store.state.users.products.productQuoteCart)
        return total + ' produtos a cotar'
      else
        return '0 produtos a cotar'
    }
  },
  methods: {
    ...mapActions("users/products", [
      "insertProductToProductList",
      "removeProductFromProductList",
      "insertProductToQuoteCart",
      "removeProductFromQuoteCart"
    ]),
    buttonClass(id) {
      if(!this.productCartIsEmpty && this.productIsOnCart(id))
        return "position-absolute w-100 rounded-bottom bg-primary collapse show"
      else
        return "position-absolute w-100 rounded-bottom bg-primary collapse"
    },
    openInfoPopup() {
      this.openPopup = !this.openPopup
    },
    removeFromCart(id) {
      this.removing = true
      this.removeProductFromQuoteCart(id).then(() => {
        this.cartInfo("Produto removido da cotação", "remove-cart-toast-class", "feather icon-minus-circle")
        setTimeout(() => {
          this.removing = false
        }, 300);
      })
    },
    addToCart(id) {
      this.adding = true
      this.openLoadingInDiv()
      this.insertProductToQuoteCart(id).then(() => {
        this.cartInfo(this.addedInfo, "add-cart-toast-class", "feather icon-plus-circle")
        setTimeout(() => {
          this.adding = false
        }, 300);
      })
    },
    openLoadingInDiv() {
      let container = '#div-with-loading' + this.product.id
      this.$vs.loading({
        container: container,
        scale: 0.6
      })
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    blockProductTypeTitle: {
      type: Boolean
    }
  },
  components: {
    VProductCardTitle,
    VSecondaryCharacteristics,
    ProductInfoModal,
  },
};
</script>
