<template>
  <a :href="$router.resolve({name: 'public-store' , params: { supplierSlug: product.supplierProductExpeditions[0].supplier.name_for_url }}).href" class="row" v-if="expeditions.length">
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
    <div  class="col-12">
      <div class="col-12 p-0 pb-1 pt-1">
        <p class="m-0" style="color: #333;">
          {{ productBrandName }}<span v-if="productBrandName && product.productLineName">,</span>
          {{ product.productLineName }}<span v-if="product.productLineName && product.productLineExtensionName">,</span>
          {{ product.productLineExtensionName }}
        </p>
        <p class="m-0 font-weight-bold text-success"><b>{{ product.propertyName }}</b></p>
      </div>
      <div class="col-12 p-0 pb-1 font-small-3">
       
      </div>
    </div>
    <div  class="col-12">
     <div
       :class="expeditions.length > 1 ? 'row' : 'row h-100'"
       v-for="expedition in lowestPrice(expeditions)"
       :key="expedition.id"
     >
       <div class="col-12 pb-1 h-100">
         <div class="row" v-if="expedition.unavailability">
           <div class="col-12">
             <span class="text-warning" v-if="!product.packagingName && !product.quantity">
               a granel
             </span>
             <span v-else>
               <span class="text-warning">
                 <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                   {{ product.unitsOfMeasurementName }}
                 </span>
                 <span v-else>
                   {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                 </span>
               </span>
             </span>
           </div>
           <div class="col-12" style="margin-top: 8px;">
            <span class="badge badge-pill font-small-3" style="margin-right: 5px; color: #4d4d4d; background-color: #f0f0f0;">
              Sem estoque
            </span>
          </div>
         </div>
         <div v-else class="row" style="justify-content: space-between;">
           <div class="col-12" v-if="expedition.sale && !blockSaleBadge" style="margin-bottom: 5px;">
             <span class="badge badge-pill badge-danger">
               <span class="font-medium-1"> Oferta</span>
             </span>
           </div>
           <div class="col-12">
             <span class="" v-if="!product.packagingName && !product.quantity">
               <b><span class="font-small-1">R$ </span><span class="font-medium-3">{{ formatPrice(expedition.price).substring(3) }}</span></b>
               <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                 p/ kg
               </span>
               <span v-else>
                 <span v-if="product.packagingName != 'Und.'" >
                   <span v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</span>
                   <span v-else> p/ und</span>
                 </span>
               </span>
               <div class="text-warning">
                 a granel
               </div>
             </span>
             <span v-else>
               <span class="font-small-1" v-if="expeditions.length > 1">
                 A partir de<br>
               </span>
               <b><span class="font-small-1">R$ </span><span class="font-medium-3">{{ formatPrice(calculatePrice(expedition, product)).substring(3) }}</span></b>
               <br>
               <span class="text-warning">
                 <span v-if="product.packagingName == 'Und.' && product.quantity == 1">
                   {{ product.unitsOfMeasurementName }}
                 </span>
                 <span v-else>
                   {{ product.packagingName }} {{ product.quantity }} {{ product.unitsOfMeasurementName }}
                 </span>
               </span>
             </span>
           </div>

           <div class="col-12">
             <div class="flex-fill" v-if="product.packagingName && product.quantity && pricePerBaseUnit(expedition, false)">
               <i style="color: #5f6666;" v-if="product.packagingName != 'Und.' || (product.packagingName == 'Und.' && product.unitsOfMeasurementName != 'und')">
                {{ pricePerBaseUnit(expedition, false).substring(3)}}
               </i>
               <span v-if="product.unitsOfMeasurementMeasureType == 'solid'">
                 <i style="color: #5f6666;" > p/ kg</i>
               </span>
               <span v-else>
                 <span v-if="product.packagingName != 'Und.'" >
                   <i style="color: #5f6666;" v-if="product.unitsOfMeasurementMeasureType == 'liquid'"> p/ L</i>
                   <i style="color: #5f6666;" v-else> p/ und</i>
                 </span>
               </span>

             </div>
             
           </div>
           <div class="col-12 p-0 text-left" style="">
             <div style="margin-top: 3px;" v-if="!expedition.unavailability">
               <div class="w-100 pl-1 pr-1 mt-1" vs-type="flex" vs-justify="center" vs-align="center">
                 <span>
                   <vs-button style="width: 100%" type="line">Ir ao Fornecedor</vs-button>
                 </span>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
  </a>
</template>

<style>
 .vs-popup {
   width: 500px !important;
 }
 .button-blue {
   background-color: #27b6f6 !important;
   border-color: #27b6f6 !important;
 }
 .spin-button {
   width: 20px;
   height: 25px;
   float: left;
   border-radius: 5px !important;
 }
 .spin-input {
   width: 40px;
   float: left;
   padding: 2px 3px 2px 5px;
   font-size: 1em;
   border: 0;
   text-align: center;
 }
  span.inner {
    color: black;
    font-size: 10px;
  }
  span.outer {
    color: red;
    text-decoration: line-through;
    margin-right: 3px;
  }
</style>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import priceFormatter from "@/mixins/priceFormatter";
import cardTitle from "@/resources/products/mixins/cardTitle";
import VPopoverProductCard from "@/resources/products/components/VPopoverProductCard";
import VClamp from "vue-clamp";
import Vue from 'vue';

export default {
  name: "ProductInSaleCard",
  data() {
    return {
      showMinAlert: [],
      priceInput: [],
      totals: [],
      openPopup: false,
      openPhoto: false,
      discountValid: [],
      openAdd: false,
      noImageSrc: require(`@/assets/images/Produto-sem-imagem-Meu-Fornecedor.jpg`),
      tempCart: [],
    }
  },
  created() {
    for(var i = 0; i < this.expeditions.length; i++) {
      this.discountValid.push({ id: this.expeditions[i].id, values: [false, false] })
      var found = this.storeProducts.find(obj => this.expeditions[i].id == obj.id)
      if(found) {
        this.priceInput[this.expeditions[i].id] = String(found.quantity).replace('.', ',')
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.$emit('all-mounted')
    })
  },
  updated() {
  },
  computed: {
    ...mapState("users/products", ["storeProducts"]),
    ...mapGetters("navigationFilters", ["params", "allowEntrance"]),
    canAdd() {
      for(var i = 0; i < this.expeditions.length; i++) {
        if(this.priceInput[this.expeditions[i].id] && this.priceInput[this.expeditions[i].id] > 0)
          return false
      }
      return true
    },
    hasExpAdded() {
      for(var i = 0; i < this.expeditions.length; i++) {
        if(this.storeProducts.find(obj => this.expeditions[i].id == obj.id))
          return true
      }
      return false
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    totals() {
      this.$emit('quantity-input', this.totals)
    }
  },
  methods: {
    ...mapActions("navigationFilters", [
      "setCep",
      "setCity",
      "setRegion",
      "setAllowed",
      "setSupplierServes",
      "clearCity",
      "clearFilterParams",
    ]),
    expText(expedition, product) {
      var text = ''
      if(expedition.productExpeditionQuantity && expedition.productExpeditionQuantity > 1) {
        if(expedition.productExpeditionMediumName)
          text = text + expedition.productExpeditionMediumName
        if(expedition.productExpeditionQuantity)
          text = text + ' ' + expedition.productExpeditionQuantity
      }
      if(product.packagingName)
        text = text + ' ' + product.packagingName
      return text
    },
    validDiscountById(id) {
      var found = this.discountValid.find(obj => obj.id == id)
      if(found)
        return found.values
      else
        return []
    },
    quantityClass(id) {
      if(this.showMinAlert[id])
        return 'spin-input is-invalid'
      else
        return 'spin-input'
    },
    tooltipText(exp) {
      if(this.product.packagingName)
        return `Qtd mínima: ${exp.minimumOrder}`
      else
        return `Qtd mínima: ${exp.minimumOrder} ${this.product.unitsOfMeasurementName}`
    },
    isDisabled(exp, id) {
      if(exp.minimumOrder && (parseFloat(this.priceInput[id]) < parseFloat(exp.minimumOrder) || !parseFloat(this.priceInput[id]))) {
        return true
      } else {
        return false
      }
    },
    expeditionPrice(price, quantity, type = null) {
      if(quantity)
        return (price * quantity)
      else
        return price
    },
    calculatedPrice(id, quantity, price) {
      let result = quantity * price
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    calculatedPriceWithDiscount(priceObj, quantity, price) {
      let result = this.checkDiscounts(priceObj, quantity, price, false)
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    emitPrice(priceObj, quantity, price, minimum) {
      var formattedQuantity = this.formatQuantity(quantity)
      if(minimum && quantity != '' && formattedQuantity < minimum)
        this.showMinAlert[priceObj.id] = true
      else
        this.showMinAlert[priceObj.id] = false

      quantity = this.verifyAllowed(priceObj.id, quantity)
      let calcQuantity = this.formatQuantity(quantity)
      let result = this.checkDiscounts(priceObj, calcQuantity, price)

      let exists = this.tempCart.find(exp => exp.id == priceObj.id)
      if(exists) {
        exists.quantity = calcQuantity
        exists.total = result
      } else {
        let obj = { id: priceObj.id, quantity: calcQuantity, total: result, minimum: minimum }
        this.tempCart.push(obj)
      }
      //this.$emit('quantity-input', obj)
    },
    checkDiscounts(priceObj, calcQuantity, price, checkArray = true) {
      var range1 = priceObj.discountRange1
      var range2 = priceObj.discountRange2
      var discount1 = priceObj.discountPercentage1
      var discount2 = priceObj.discountPercentage2

      var total = 0

      var discountData = this.discountValid.find(obj => obj.id == priceObj.id)

      if(!range1 && !range2) {
        total = calcQuantity * price
        if(checkArray && discountData) discountData.values = [false, false]
      } else if(range1 && !range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) discountData.values = [true, false]
      } else if(range1 && !range2 && calcQuantity < range1) {
        total = calcQuantity * price
        if(checkArray && discountData) discountData.values = [false, false]
      } else if(range2 >= range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
        if(checkArray && discountData) discountData.values = [false, true]
      } else if(range1 > range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) discountData.values = [true, false]
      } else if(calcQuantity < range1 && calcQuantity < range2) {
        total = calcQuantity * price
        if(checkArray && discountData) discountData.values = [false, false]
      } else if(range2 >= range1 && calcQuantity < range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
        if(checkArray && discountData) discountData.values = [true, false]
      } else if(range1 > range2 && calcQuantity < range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
        if(checkArray && discountData) discountData.values = [false, true]
      }

      return total
    },
    calculatePrice(priceObj, product) {
      var price = priceObj.price
      if(priceObj && priceObj.productExpeditionPricing) {
        if(priceObj.productExpeditionPricing == 1) {
          price = parseFloat(priceObj.price) * parseFloat(this.product.quantity.replace(',', '.'))
          if(product.packageQuantity)
             price = price * parseFloat(this.product.packageQuantity)
        } else if(priceObj.productExpeditionPricing == 2) {
          price = priceObj.price
        } else if(priceObj.productExpeditionPricing == 3) {
          price = parseFloat(priceObj.price) / parseFloat(priceObj.productExpeditionQuantity)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        }
      }
      return price
    },
    formatQuantity(quantity) {
      if(quantity && String(quantity).includes(','))
        quantity = String(quantity).replace(',', '.')
      return quantity
    },
    verifyAllowed(id, quantity) {
      var regex = null
      if(this.product.packagingName) {
        regex = /^[0-9]+$/
      } else {
        regex = /^(\d+)(.\d{0,2})?$/
      }
      if(!regex.test(quantity)) {
        this.priceInput[id] = quantity.slice(0, -1)
      }
      return this.priceInput[id]
    },
    openInfoPopup() {
      this.openPopup = !this.openPopup
    },
    updateModal(value) {
      this.openPhoto = value
    },
    openPhotoModal() {
      this.openPhoto = true
    },
    pricePerBaseUnit(priceObj, withUnit = true) {
      var price = 0

      if(priceObj && priceObj.productExpeditionPricing) {
        if(priceObj.productExpeditionPricing == 1)
          price = this.product.unitsOfMeasurementEquivalence * parseFloat(priceObj.price)
        else if(priceObj.productExpeditionPricing == 2) {
          price = (this.product.unitsOfMeasurementEquivalence / parseFloat(this.product.quantity.replace(',', '.'))) * parseFloat(priceObj.price)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        } else if(priceObj.productExpeditionPricing == 3) {
          price = (this.product.unitsOfMeasurementEquivalence / (parseFloat(this.product.quantity.replace(',', '.')) * parseFloat(priceObj.productExpeditionQuantity))) * parseFloat(priceObj.price)
          // if(this.product.packageQuantity)
          //   price = price / parseFloat(this.product.packageQuantity)
        }
      }

      var text = this.formatPrice(price)
      if(withUnit) {
        switch(this.product.unitsOfMeasurementMeasureType) {
          case 'solid':
            text = this.formatPrice(price) + ' p/ kg'
            break;
          case 'liquid':
            text = this.formatPrice(price) + ' p/ L'
            break;
        }
      }
      return text
    },
    textPerExpedition(price) {
      var pricePerUnit = this.formatPrice(this.calculatePrice(price, this.product)) + ' p/ '
      if(!this.product.packagingName && !this.product.quantity)
        pricePerUnit = pricePerUnit.concat(' ' + this.product.unitsOfMeasurementName)
      else
        pricePerUnit = pricePerUnit.concat(this.product.packagingName + ' ' + this.product.quantity + this.product.unitsOfMeasurementName)
      if(parseInt(this.product.packageQuantity) > 1)
        pricePerUnit = pricePerUnit.concat(' x' + this.product.packageQuantity)

      var text = pricePerUnit + '                                      ' + this.pricePerBaseUnit(price, true)

      return text
    },
    isInteger(expedition) {
      if(expedition.productExpeditionQuantity)
        return true
      else
        return false
    },
    checkOpenAdd(ev) {
      if(this.$auth.check() || (this.allowEntrance && this.allowEntrance != 'false'))
        this.openAdd = true
      else {
        this.openAdd = false
        this.$emit('fill-location', ev.target)
      }
    },
    removeFromCart() {
      for(var i = 0; i < this.expeditions.length; i++) {
        this.$emit('remove-item', this.expeditions[i])
      }
      this.openAdd = false
    },
    addToCart() {
      for(var i = 0; i < this.tempCart.length; i++) {
        this.$emit('quantity-input', this.tempCart[i])
      }
      this.openAdd = false
    },
    lowestPrice(expeditions) {
      var lowest = expeditions[0]
      if(expeditions.length > 1) {
        for(var i = 0; i < expeditions.length; i++) {
          if((expeditions[i].price < lowest.price) && !expeditions[i].unavailability)
            lowest = expeditions[i]
          else if(lowest.unavailability)
             lowest = expeditions[i]
        }
      }
      return [lowest]
    },
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    expeditions: {
      type: Array,
      required: true,
    },
    loadedTotals: {
      type: Array
    },
    blockSaleBadge: {
      type: Boolean
    }
  },
  components: {
  },
  mixins: [priceFormatter, cardTitle]
};
</script>
<style>
._horizontal-scroll[data-v-5ce095ec]{box-sizing:border-box;overflow-x:auto;overflow-y:hidden;text-align:left;white-space:nowrap}

.vs-tooltip {
  white-space: pre-wrap;
}
</style>
