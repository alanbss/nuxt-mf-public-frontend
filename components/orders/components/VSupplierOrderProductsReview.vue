<template>
  <div>
    <div v-for="family in families" :key="family.id">
      <span v-if="hasProductsFromFamily(family.name)">
        <div class="bg-rgba-primary mb-2 p-1 rounded">
          <h4 class="m-0">
            <i class="fa fa-lemon-o ml-50 mr-75"></i>
            {{ family.name }}
          </h4>
        </div>

        <div v-for="category in familyCategories(family.name)" :key="category.id">
          <h5 class="text-primary">{{ category.name }}</h5>

          <span v-for="productType in typesFromCategory(category.id)" :key="productType.id">
            <h6 class="my-1">
              {{ productType.productType }}
            </h6>
            <div class="card shadow-sm">
              <div class="card-body px-50 py-0">
                <div class="table-responsive">
                  <table class="table mb-0">
                      <thead>
                        <tr>
                            <th class="border-0" colspan="3">Descrição</th>
                            <th class="border-0">Foto</th>
                            <th class="border-0">Volume</th>
                            <th class="border-0">Exped.</th>
                            <th class="border-0">Preço</th>
                            <th class="border-0">Qtd.</th>
                            <th class="border-0">Subtotal</th>
                            <th class="border-0">Seu código</th>
                        </tr>
                      </thead>
                      <tbody
                        v-for="product in fromProductType(productType.productType)"
                        :key="product.id"
                      >
                        <tr
                          v-for="price in productPrices(product.id)"
                          :key="price.id"
                        >
                          <td style="width: 20%;" class="align-top">
                            <span class="mr-1">
                              <span v-if="product.brandName">{{ product.brandName }}</span>
                              <span v-else>(marca não def.)</span>
                              <span v-if="product.productLineName">
                                / {{ product.productLineName }}
                              </span>
                              <span v-if="product.productLineExtensionName">
                                / {{ product.productLineExtensionName }}
                              </span>
                            </span>
                          </td>
                          <td style="width: 5%;" class="align-top">
                            <span class="mr-1 font-weight-bold">{{ product.propertyName }}</span>
                          </td>
                          <td style="width: 20%;" class="align-top">
                            <span>{{ secondaryAndComments(product) }} </span>
                          </td>
                          <td style="width: 5%;" class="align-top">
                            <product-photo-modal v-if="openPhoto[product.id] != undefined" :product="product" :openPopup="openPhoto[product.id]" :sendId="true" @update-modal="updateModal" />
                            <a
                              href="javascript:void(0);"
                              @click="openPhotoModal(product.id)"
                              data-toggle="lightbox"
                              title="Foto do produto"
                              data-title="Maionese"
                              class="float-right"
                              tabindex="-1"
                            >
                              <i class="feather icon-image font-medium-1"></i>
                            </a>
                          </td>
                          <td style="width: 10%;" class="align-top">
                            {{ quantifiers(product) }}
                          </td>
                          <td style="width: 8%;" class="align-top">
                            {{ expeditionName(price) }}
                          </td>
                          <td style="width: 8%;" class="align-top">
                            <span v-if="price.supplierProductExpedition.productExpeditionQuantity">
                              {{ formatPrice(calculatePrice(price, product) * price.supplierProductExpedition.productExpeditionQuantity) }}
                            </span>
                          </td>
                          <td style="width: 5%;" class="align-top">
                              <strong class="text-success">
                                {{ String(price.quantity).replace('.', ',') }}
                              </strong>
                          </td>
                          <td style="width: 10%;" class="align-top">
                            <strong class="text-dark">
                              {{ formatPrice(calculatedPriceWithDiscount(price, formatQuantity(price.quantity), expeditionPrice(calculatePrice(price, product), price.supplierProductExpedition.productExpeditionQuantity))) }}
                            </strong>
                          </td>
                          <td style="width: 10%;" class="align-top">
                            {{ price.supplierProductExpedition.supplierProductCode }}
                          </td>
                        </tr>
                      </tbody>
                  </table>
                </div>
              </div>
            </div>
          </span>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";
import priceFormatter from "@/mixins/priceFormatter";
import ProductPhotoModal from "@/resources/products/components/ProductPhotoModal";

export default {
  data() {
    return {
      families: [],
      uniqueProductTypes: [],
      typesAndCategories: [],
      total: undefined,
      openPhoto: [],
    }
  },
  mounted() {

  },
  computed: {
    ...mapState("orders", [
      "orderCategories",
      "orderExpeditions"
    ]),
  },
  created() {
    this.getOrderCategories({ id: this.order.id }).then(() => {
      for(let i = 0; i < this.orderCategories.length; i++) {
        if(!this.families.find(family => family.id == this.orderCategories[i].family.id))
          this.families.push(this.orderCategories[i].family)
      }
      if(this.families.length)
        this.families.sort((a, b) => a.name.localeCompare(b.name))
    })
    for(let k = 0; k < this.products.length; k++) {
      this.openPhoto[this.products[k].id] = false
    }
    this.getPricesByOrder(this.order.id).then(() => {
      //this.productsWithPrices()
      this.buildProductTypes()
    })
    this.uniqueProductTypes = [...new Set(this.products.map(item => item.productTypeName))]
  },
  methods: {
    ...mapActions("orders", [
      "getOrderCategories",
      "getPricesByOrder"
    ]),
    updateData() {
      for(let k = 0; k < this.products.length; k++) {
        if(this.openPhoto[this.products[k].id] == undefined) {
          this.openPhoto[this.products[k].id] = false
        }
      }
      this.typesAndCategories = []
      this.buildProductTypes()
    },
    calculatedPriceWithDiscount(priceObj, quantity, price) {
      let result = this.checkDiscounts(priceObj, quantity, price)
      if(!isNaN(result)) {
        return result
      }
      else
        return 0
    },
    calculatePrice(priceObj, product) {
      var price = priceObj.supplierProductExpedition.price
      if(priceObj.supplierProductExpedition.productExpeditionPricing == 1) {
        price = parseFloat(priceObj.supplierProductExpedition.price) * parseFloat(product.quantity.replace(',', '.'))
        if(product.packageQuantity)
           price = price * parseFloat(product.packageQuantity)
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 2) {
        price = priceObj.supplierProductExpedition.price
      } else if(priceObj.supplierProductExpedition.productExpeditionPricing == 3) {
        price = parseFloat(priceObj.supplierProductExpedition.price) / parseFloat(priceObj.supplierProductExpedition.productExpeditionQuantity)
        // if(this.product.packageQuantity)
        //   price = price / parseFloat(this.product.packageQuantity)
      }
      return price
    },
    checkDiscounts(priceObj, calcQuantity, price) {
      var range1 = priceObj.supplierProductExpedition.discountRange1
      var range2 = priceObj.supplierProductExpedition.discountRange2
      var discount1 = priceObj.supplierProductExpedition.discountPercentage1
      var discount2 = priceObj.supplierProductExpedition.discountPercentage2

      var total = 0

      if(!range1 && !range2) {
        total = calcQuantity * price
      } else if(range1 && !range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(range1 && !range2 && calcQuantity < range1) {
        total = calcQuantity * price
      } else if(range2 >= range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
      } else if(range1 > range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(calcQuantity < range1 && calcQuantity < range2) {
        total = calcQuantity * price
      } else if(range2 >= range1 && calcQuantity < range2 && calcQuantity >= range1) {
        total = calcQuantity * price * ((100 - discount1) * 0.01)
      } else if(range1 > range2 && calcQuantity < range1 && calcQuantity >= range2) {
        total = calcQuantity * price * ((100 - discount2) * 0.01)
      }

      return total
    },
    familyCategories(familyName) {
      var array = this.typesAndCategories.filter(obj => obj.familyName == familyName)
                                         .map(obj => obj.category)
      return this.orderCategories.filter(category => array.includes(category.id))
    },
    // productsWithPrices() {
    //   this.boughtProducts = this.quotationPrices
    //                             .filter(price => (price.quantity))
    //                             .map(obj => obj.supplierProductExpedition.productExpeditionProductId)
    // },
    productPrices(productId) {
      return this.orderExpeditions
                 .filter(price =>
                   price.supplierProductExpedition.productExpeditionProductId == productId)
    },
    fromProductType(productType) {
      var prods = this.products.filter(prod => prod.productTypeName == productType)
      var sorted = prods.sort((a, b) => {
        if (a.brandName < b.brandName)
         return -1;
        if (a.brandName > b.brandName)
          return 1;
        return 0;
      })
      return sorted
    },
    typesFromCategory(categoryId) {
      return this.typesAndCategories.filter(obj => obj.category == categoryId)
    },
    buildProductTypes() {
      for(let i = 0; i < this.products.length; i++) {
        if(!this.typesAndCategories.find(obj => obj.productType == this.products[i].productTypeName)) {
          this.typesAndCategories.push({ category: this.products[i].categoryId,
                                         productType: this.products[i].productTypeName,
                                         familyName: this.products[i].familyName })
        }
      }
    },
    hasProductsFromFamily(familyName) {
      if(this.products && this.products.length)
        return this.products.find(prod => (prod.familyName == familyName))
      else
        return false
    },
    secondaryAndComments(product) {
      let secondary = [...product.secondaryCharacteristics]
      secondary.sort()

      if(product.comments)
        return secondary.join(" | ") + " | " + product.comments
      else
        return secondary.join(" | ")
    },
    quantifiers(product) {
      let packagingName = product.packagingName;

      if (packagingName) {
        return `${product.packagingName} / ${product.quantity} ${product.unitsOfMeasurementName}`;
      } else {
        return `${product.unitsOfMeasurementName}`;
      }
    },
    expeditionName(price) {
      if(price.supplierProductExpedition.productExpeditionMediumName != 'un.' && price.supplierProductExpedition.productExpeditionMediumName)
        return price.supplierProductExpedition.productExpeditionMediumName + " " + price.supplierProductExpedition.productExpeditionQuantity
      else if(price.supplierProductExpedition.productExpeditionQuantity)
        return "x " + price.supplierProductExpedition.productExpeditionQuantity
      else
        return ""
    },
    expeditionPrice(price, quantity) {
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
    formatQuantity(quantity) {
      if(quantity && String(quantity).includes(','))
        quantity = String(quantity).replace(',', '.')
      return quantity
    },
    updateModal(val, id) {
      this.$set(this.openPhoto, id, val)
    },
    openPhotoModal(id) {
      this.$set(this.openPhoto, id, true)
    },
  },
  props: {
    order: {
      type: Object,
      required: true
    },
    products: {
      type: Array,
      required: true
    },
  },
  components: {
    ProductPhotoModal
  },
  mixins: [priceFormatter]
};
</script>
