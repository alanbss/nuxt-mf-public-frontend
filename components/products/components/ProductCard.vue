<template>
<div >
<div class="row" @click="checkOpenAdd($event)" >
    <div  class="col-12 pt-1">
      <a
        href="javascript:void(0);"
        data-toggle="lightbox"
        title="Foto do produto"
        data-title="Maionese"
        class="float-right"
        tabindex="-1"
      >
        <img v-if="product.picture" class="rounded img-fluid" :src="product.picture" alt style="width: 100%; height: auto;" />
        <img v-else class="rounded img-fluid" :src="noImageSrc" alt style="width: 100%; height: auto;" />
        <div class="badge badge-pill badge-md bg-mf-laranja" style="position: absolute; bottom: 5px; left: 10px;">
          <b>{{ quantifiers(true) == 'Und. 1 und' ? 'Und' :  quantifiers(true) }}</b>
        </div>
      </a>
    </div>
    <div  class="col-12" >
      <div class="col-12 p-0 pb-1 pt-1">
        <p class="m-0" style="color: #333;">
          {{ productBrandName }}<span v-if="productBrandName && product.productLineName">,</span>
          {{ product.productLineName }}<span v-if="product.productLineName && product.productLineExtensionName">,</span>
          {{ product.productLineExtensionName }}
        </p>
        <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
      </div>
      <div class="col-12 p-0 pb-1 font-small-3">
        <v-new-secondary-characteristics :product="product" />
      </div>
    </div>
  <div
    :class="'card-text clearfix p-0 position-relative'"
    v-if="!isProductList || (isProductList && product.hasSupplier)"
    style="width: -webkit-fill-available;"
  >
    <div class="bg-transparent rounded-bottom">
      <a
        data-toggle="collapse"
        href="javascript:void(0)"
        aria-expanded="false"
        :aria-controls="'collapseCotacaoCard-' + product.id"
        @click="checkOpenAdd($event)"
        class="card-link pl-1 font-weight-bold d-block collapsed"
        style="padding-bottom: 8px"
        :ref="'addProduct' + product.id"
        v-if="!adding && !product.onQuotation"
      >
        Adicionar à cotação
      </a>
      <div
        v-else-if="product.onQuotation"
        class="position-absolute w-100 rounded-bottom collapse show"
        style="top: 0px; background-color: #dcdcdc; max-height: 28px"
      >
        <span
          class="text-center float-left w-75 d-block"
          style="padding-top: 5px"
          >Já em cotação</span
        >
        <a
          data-toggle="collapse"
          aria-expanded="false"
          title="Abrir cotação que contém este produto"
          class="
            text-center
            float-right
            bg-white
            d-block
            w-25
            text-body
            collapsed
          "
          style="border-bottom-right-radius: 0.4rem; padding: 0.2rem 0.6rem"
          @click="openQuotation(product.onQuotation.quoteId)"
        >
          Ver
        </a>
      </div>
      <span v-show="adding">
        <div
          :id="'div-with-loading' + this.product.id"
          class="vs-con-loading__container"
        >
          Adicionando...
        </div>
      </span>
    </div>
    <div
      :class="buttonClass(product.id)"
      :id="'collapseCotacaoCard-' + product.id"
      style="top: 0px; max-height: 28px"
    >
      <span
        v-if="!removing"
        class="text-center float-left w-75 font-weight-bold d-block text-white"
        style="padding-top: 5px"
        >Adicionado</span
      >
      <span
        v-else
        class="text-center float-left w-75 font-weight-bold d-block text-white"
      >
        <div
          :id="'div-with-loading' + this.product.id"
          class="vs-con-loading__container"
          style="padding-top: 5px"
        >
          Removendo...
        </div>
      </span>
      <a
        href="javascript:void(0)"
        data-toggle="collapse"
        aria-expanded="false"
        :aria-controls="'#collapseCotacaoCard-' + product.id"
        title="Remover da cotação"
        class="text-center float-right bg-white d-block text-body collapsed"
        style="border-bottom-right-radius: 0.4rem; padding: 0.2rem 0.6rem"
        @click="removeFromCart(product.id)"
      >
        <i class="feather icon-x font-medium-3"></i>
      </a>
    </div>
  </div>
  </div>
  <zipcode-not-found-modal
    :openPopup="openNoZipcode"
    @update-modal="updateZipcodeNotFound"
    v-if="opened"
  />
  <mailing-list-modal
    :openPopup="openUnavailableUf"
    @update-modal="updateUnavailableUf"
    :uf="ufId"
    v-if="opened"
  />
  <vs-popup title="Defina sua localização" :active.sync="active">
      <h4 style="font-weight: normal;">Veja os produtos das distribuidoras locais</h4>
      <div
        class="bg-white shadow-sm rounded p-2"
        data-aos="fade-right"
        data-aos-delay="150"
        style="margin-bottom: 20px"
      >
        <div class="row" style="margin: 0px; max-height: 70px">
          <div class="form-group">
            <label
              ><small><strong>Seu CEP</strong></small></label
            >
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i class="feather icon-map-pin" />
                </div>
              </div>
              <input
                :id="'cepInput' + product.id"
                data-vv-name="zipcode"
                v-mask="'#####-###'"
                input
                type="tel"
                pattern="[0-9]*"
                novalidate
                class="form-control required"
                v-model="zipcode"
                :style="
                  errorColor == 'red' ?
                  'max-width: 90px; padding-left: 5px; border-radius: 0px 5px 5px 0px; border: solid 1px red;' :
                  'max-width: 90px; padding-left: 5px; border-radius: 0px 5px 5px 0px;'"
                autofocus
              />
              <b-tooltip
                v-if="show && isDisabled"
                :show.sync="show"
                :target="'cepInput' + product.id"
                placement="top"
              >
                Digite seu CEP
              </b-tooltip>
            </div>
            <small
              id=""
              class="form-text text-muted mt-1"
              :style="
                'max-width: 90px; color: ' + errorColor + '!important; margin: 5px 0px 0px 0px !important;'"
              ><b>{{ cityText }}</b></small
            >
          </div>
          <div class="form-group">
            <label
              ><small><strong>Você é...</strong></small></label
            >
            <div class="input-group">
              <div v-if="!isMobile" class="input-group-prepend">
                <div class="input-group-text">
                  <i
                    v-if="this.userType == 'PJ'"
                    class="feather icon-briefcase"
                  />
                  <i v-if="this.userType == 'PF'" class="feather icon-user" />
                </div>
              </div>
              <select
                class="custom-select select-size"
                id=""
                v-model="userType"
                style="padding-left: 5px"
              >
                <option value="PJ">Pessoa jurídica</option>
                <option value="PF">Pessoa física</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>&nbsp;</label>
            <vs-tooltip ref="minTooltip" text="É preciso preencher os campos ao lado." :active="isDisabled" position="bottom">
              <span>
                <button
                  id="btnEntrar"
                  type="submit"
                  class="btn btn-primary btn-block btn-size"
                  :disabled="isDisabled"
                  @click="setParams()"
                  style="
                    background: linear-gradient(
                      45deg,
                      rgba(3, 145, 209, 1) 50%,
                      rgba(5, 242, 240, 1) 100%
                    );
                    font-weight: 800;
                    opacity: 1;
                  "
                >
                  Entrar
                </button>
              </span>
              <span>&nbsp;</span>
            </vs-tooltip>
          </div>
        </div>
        <div
          v-if="userType == 'PF'"
          class="alert alert-dark font-small-3"
          role="alert"
          style="max-width: fit-content; margin-top: 20px"
        >
          <p align="justify">
            Alguns fornecedores não atendem CPF, então a quantidade de produtos
            a disposição pode ser menor.
          </p>
        </div>
        <div class="dropdown-divider" />
        <div class="text-right">
          <p class="mt-1 mb-0">Já tem cadastro?</p>
          <login-dropdown linkText="Entrar" v-if="opened" />
        </div>
      </div>
    </vs-popup>
    <vs-popup title="Um momento..." :active.sync="showLoadingAlert">
      <div>
        <h5 class="d-flex justify-content-center">Carregando os produtos de distribuidoras da sua região.</h5>
        <div class="d-flex justify-content-center" style="margin-top: 20px; margin-bottom: 20px;">
          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </vs-popup>
  </div>
</template>

<style scoped>
@media only screen and (min-width: 768px) {
  .photo-height {
    height: 200px;
  }
}
@media only screen and (max-width: 767px) {
  .photo-height {
    height: 150px;
  }
}
.type-link {
  color: inherit;
}
.type-link:hover {
  color: inherit;
  text-decoration: underline;
}
</style>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import { mask } from "vue-the-mask";
import VNewSecondaryCharacteristics from "~/components/products/components/VNewSecondaryCharacteristics";
import cardTitle from "~/components/products/mixins/cardTitle";
import LoginDropdown from "~/components/login/LoginDropdown";
import MailingListModal from "~/components/users/components/MailingListModal";
import ZipcodeNotFoundModal from "~/components/users/components/ZipcodeNotFoundModal";
import StateService from "~/components/users/services/StateService";

export default {
  name: "ProductCard",
  data() {
    return {
      openPopup: false,
      adding: false,
      removing: false,
      noImageSrc: require(`~/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`),
      zipcode: undefined,
      userType: 'PJ',
      cityText: "",
      allowedUf: false,
      show: false,
      active: false,
      openUnavailableUf: false,
      openNoZipcode: false,
      opened: false,
      errorColor: 'black',
      showLoadingAlert: false,
    };
  },
  created() {
  },
  watch:{
    // cityId(newValue) {
    //   if(this.active) {
    //     if (newValue && newValue != "erro") {
    //       setTimeout(() => {
    //         this.cityText = this.informedCity + "/" + this.informedUF;
    //         if (this.informedUF) this.checkForUf(this.informedUF);
    //       }, 100);
    //     } else if (newValue == "erro") {
    //       this.cityText = "CEP não encontrado";
    //       this.$vs.loading.close();
    //       this.openNoZipcode = true;
    //       this.allowedUf = false;
    //       this.active = false
    //     }
    //   }
    // },
    // ufId(newValue) {
    //   if(this.active) {
    //     if (newValue) {
    //       setTimeout(() => {
    //         this.cityText = this.informedCity + "/" + this.informedUF;
    //         if (this.informedUF) this.checkForUf(this.informedUF);
    //       }, 100);
    //     }
    //   }
    // },
  },
  computed: {
    ...mapState("navigationFilters", ["city", "allowed"]),
    ...mapGetters("navigationFilters", [
                  "params",
                  "allowEntrance",
                  "informedCity",
                  "informedUF"]),

    ...mapGetters("users/products", [
                  "productIsOnList",
                  "productIsOnCart",
                  "productCartIsEmpty",]),

    isDisabled() {
      if (
        this.userType &&
        this.zipcode &&
        this.zipcode.length == 9
      )
        return false;
      else
        return true;
    },
    cityId() {
      return this.informedCity;
    },
    ufId() {
      return this.informedUF;
    },
    classes() {
      // if (this.isProductTypeView) {
      //   return "col-xl-2 col-md-4 col-6 mb-5";
      // }

      // if (this.isCategoryView || this.isFamilyView || this.isSearchView) {
      //   return "col-xl-3 col-md-4 col-6 mb-5";
      // }

      return "mb-1";
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
      var total = this.$store.state.users.products.productQuoteCart.length + 1;
      if (this.$store.state.users.products.productQuoteCart)
        return total + " produtos a cotar";
      else return "0 produtos a cotar";
    },
    hasWidth() {
      if (this.widthRatio) return "width: " + this.widthRatio + "%;";
      else return "";
    },
  },
  methods: {
    ...mapActions("users/products", [
      "insertProductToProductList",
      "removeProductFromProductList",
      "insertProductToQuoteCart",
      "removeProductFromQuoteCart",
      "canAddProduct",
    ]),

    ...mapActions("navigationFilters", [
      "setCep",
      "setCity",
      "setRegion",
      "setAllowed",
      "setSupplierServes",
      "clearCity",
      "clearFilterParams",
      "setAllowed",
    ]),

    checkOpenAdd(ev) {
      if(this.$auth.check() || (this.allowEntrance && this.allowEntrance != 'false'))
        this.addOrRemoveToCart(this.product)
      else {
        this.opened = true
        this.active = true
        setTimeout(() => {
          document.getElementById('cepInput' + this.product.id).focus()
        }, 500)
      }
    },
    openQuotation(quoteId) {
      this.$router.push({
        name: "users.quotePanel",
        params: { quoteId: quoteId },
      });
    },
    buttonClass(id) {
      if (!this.productCartIsEmpty && this.productIsOnCart(id))
        return "position-absolute w-100 rounded-bottom bg-primary collapse show";
      else return "position-absolute w-100 rounded-bottom bg-primary collapse";
    },
    backgroundClass(id) {
      if (!this.productCartIsEmpty && this.productIsOnCart(id))
        return " bg-white";
      else return " bg-transparent";
    },
    addOrRemoveToCart(product) {
      if (!this.adding && !this.removing && !product.onQuotation) {
        if (this.productIsOnCart(product.id)) this.removeFromCart(product.id);
        else this.addToCart(product.id);
      }
    },
    updateInfoPopup(val) {
      this.openPopup = val;
    },
    removeFromCart(id) {
      this.removing = true;
      this.removeProductFromQuoteCart(id).then(() => {
        this.cartInfo(
          "Produto removido da cotação",
          "remove-cart-toast-class",
          "feather icon-minus-circle"
        );
        setTimeout(() => {
          this.removing = false;
        }, 300);
      });
    },
    addToCart(id) {
      this.adding = true;
      this.openLoadingInDiv();
      this.insertProductToQuoteCart(id).then(() => {
        this.cartInfo(
          this.addedInfo,
          "add-cart-toast-class",
          "feather icon-plus-circle"
        );
        setTimeout(() => {
          this.adding = false;
        }, 300);
      });
    },
    openLoadingInDiv() {
      let container = "#div-with-loading" + this.product.id;
      this.$vs.loading({
        container: container,
        scale: 0.6,
      });
    },
    openLocationPopup(target) {
      this.targetClick = target
      this.openLocation = true
    },
    imgAltText() {
      return `${this.product.productTypeName} ${this.product.propertyName} ${
        this.quantifiers(true) == "Und. 1 und" ? "Und" : this.quantifiers(true)
      } ${this.product.brandName} ${
        this.product.productLineName ? this.product.productLineName : ""
      } ${
        this.product.productLineExtensionName
          ? this.product.productLineExtensionName
          : ""
      }`;
    },
    loadCep() {
      if (this.zipcode.length == 9) {
        this.clearCity();
        this.$vs.loading({ type: "point" });
        this.setCep(this.zipcode)
        this.setCity(this.zipcode).then(() => {
          if(this.informedCity == 'erro') {
            this.cityText = "CEP não encontrado";
            this.$vs.loading.close();
            this.allowedUf = false;
            this.errorColor = 'red';
          } else {
            this.errorColor = 'black';
            this.setRegion().then(() => {
              this.cityText = this.informedCity + "/" + this.informedUF;
              if(this.informedUF)
                this.checkForUf(this.informedUF)
            })
          }
        })
      }
    },
    setParams() {
      // this.$vs.loading()
      if(this.userType != this.typeId) {
        this.setSupplierServes(this.userType);
      }
      this.loadCep()
      // if (this.allowedUf) {
      //   this.$emit("allow-zipcode", true);}
      //   this.open = false;
      //   this.$router.go();

    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true;
      } else {
        return false;
      }
    },
    updateUnavailableUf(value) {
      this.openUnavailableUf = value;
    },
    updateZipcodeNotFound(value) {
      this.openNoZipcode = value;
    },
    checkForUf(uf) {
      if (uf) {
        StateService.checkForAvailableUf(uf).then((response) => {
          this.lastUf = uf;
          if (
            response?.data["available"] &&
            response?.data["available"] === "no"
          ) {
            this.openUnavailableUf = true
            this.allowedUf = null
            this.setAllowed(false)
            this.active = false
            this.clearFilterParams()
          } else if (
            response.data["available"] &&
            response.data["available"] == "yes"
          ) {
            this.openUnavailableUf = false
            this.allowedUf = true
            this.$emit("allow-zipcode", true)
            this.active = false
            this.setAllowed(true)
            this.canAddProduct(this.product.id).then((response) => {
              if(response['available'] == 'yes') {
                this.addOrRemoveToCart(this.product)
                this.showLoadingAlert = true
                setTimeout(() => {
                  window.location.replace("/?loadingProducts=true")
                  //this.$router.go()
                }, 2000)
              } else
                window.location.replace("/?loadingProducts=true")
                //this.$router.go()
            })
          }
          this.$vs.loading.close()
        });
      }
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    blockProductTypeTitle: {
      type: Boolean,
    },
    widthRatio: {
      type: Number,
    },
    isProductList: {
      type: Boolean,
    },
  },
  directives: {
    mask,
  },
  components: {
    VNewSecondaryCharacteristics,
    LoginDropdown,
    ZipcodeNotFoundModal,
    MailingListModal,
  },
  mixins: [cardTitle],
};
</script>
