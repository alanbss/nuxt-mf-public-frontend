<template>
  <div>
    <vs-popup title="Selecione a categoria" :active.sync="open">
      <div
        v-for="(family, index1) in uniqueUsedFamilies()"
        :key="index1"
        style="margin-bottom: 8px;"
      >
        <h5><span v-html="getFamilyIcon(family)"></span> <span class="capitalize">{{ family }}</span></h5>
        <span v-if="family == 'Alimentos e bebidas'">
          <span v-if="collectionsFromFamily(family).length > 1">
            <span
              v-for="(collection, index2) in collectionsFromFamily(family)"
              :key="index2"
              :vs-value="index2"
              style="display: inline-block; float: none;"
            >
              <vs-chip v-if="selectedCollection && selectedCollection == collection" style="background-color: #bc5100;" class="public-chip text-white font-small-2 font-weight-bold">
                <a @click="selectCollection(family, collection)" style="">
                  <span class="capitalize">{{ collection }}</span>
                </a>
              </vs-chip>
              <vs-chip v-else>
                <a @click="selectCollection(family, collection)" style="">
                  <span class="capitalize">{{ collection }}</span>
                </a>
              </vs-chip>
            </span>
          </span>
          <span v-else>
            <span
              v-for="(collection, index2) in collectionsFromFamily(family)"
              :key="index2"
            >
              <span
                v-for="(category, index3) in categoriesFromFamily(family, collection)"
                :key="index3"
                :vs-value="index3"
                style="display: inline-block; float: none;"
              >
                <span v-if="categoriesFromFamily(family, collection).length > 1">
                  <vs-chip
                    v-if="selectedCategory && selectedFamily && selectedCategory == category && selectedFamily == family"
                    style="background-color: #f57f17;" class="public-chip text-white font-small-2 font-weight-bold"
                  >
                    <a @click="selectCategory(family, collection, category)" style="">
                      <span class="capitalize">{{ category }}</span>
                    </a>
                  </vs-chip>
                  <vs-chip v-else >
                    <a @click="selectCategory(family, collection, category)" style="">
                      <span class="capitalize">{{ category }}</span>
                    </a>
                  </vs-chip>
                </span>
                <span v-else>
                  <span
                    v-for="(type, index4) in productTypesFromValues({ category: category, family: family, collection: collection })"
                    :key="index4"
                    :vs-value="index4"
                    style="display: inline-block; float: none;"
                  >
                    <vs-chip>
                      <a @click="selectProductType(type.productTypeId)">
                        <span class="capitalize">{{ type.productType }}</span>
                      </a>
                    </vs-chip>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
        <span v-else>
          <span
            v-for="(collection, index2) in collectionsFromFamily(family)"
            :key="index2"
          >
            <span
              v-for="(category, index3) in categoriesFromFamily(family, collection)"
              :key="index3"
              :vs-value="index3"
              style="display: inline-block; float: none;"
            >
              <span v-if="categoriesFromFamily(family, collection).length > 1">
                <vs-chip
                  v-if="selectedCategory && selectedFamily && selectedCategory == category && selectedFamily == family"
                  style="background-color: #f57f17;" class="public-chip text-white font-small-2 font-weight-bold"
                >
                  <a @click="selectCategory(family, collection, category)" style="">
                    <span class="capitalize">{{ category }}</span>
                  </a>
                </vs-chip>
                <vs-chip v-else >
                  <a @click="selectCategory(family, collection, category)" style="">
                    <span class="capitalize">{{ category }}</span>
                  </a>
                </vs-chip>
              </span>
              <span v-else>
                <span
                  v-for="(type, index4) in productTypesFromValues({ category: category, family: family, collection: collection })"
                  :key="index4"
                  :vs-value="index4"
                  style="display: inline-block; float: none;"
                >
                  <vs-chip>
                    <a @click="selectProductType(type.type.productTypeId)">
                      <span class="capitalize">{{ type.type.productType }}</span>
                    </a>
                  </vs-chip>
                </span>
              </span>
            </span>
          </span>
        </span>
      </div>
    </vs-popup>
  </div>
</template>

<style>
  span.capitalize:first-letter {
    text-transform: uppercase;
  }
  span.capitalize {
    display: inline-block;
  }
</style>

<script>
//import { mapActions, mapGetters } from "vuex";

export default {
  name: "SalesFamiliesModal",
  data() {
    return {
      open: false,

    }
  },
  created() {

  },
  watch: {
    openPopup() {
      this.open = this.openPopup
    },
    open() {
      this.$emit('update-modal', this.open)
    }
  },
  computed: {

  },
  methods: {
    selectCategory(familyName, collectionName, categoryName) {
      this.$emit('selected-category', { family: familyName, collection: collectionName, category: categoryName })
      this.open = false
    },
    selectCollection(familyName, collectionName) {
      this.$emit('selected-collection', { family: familyName, collection: collectionName })
      this.open = false
    },
    selectProductType(productTypeId) {
      this.$emit('selected-product-type', productTypeId)
      this.open = false
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentose bebidas':
          return '<img src="' + require(`@/assets/images/maca.svg`) + '" alt="*" width="16">'
        case 'Embalagens':
          return '<i class="feather icon-shopping-bag mr-25"></i>'
        case 'Limpeza':
          return '<img src="' + require(`@/assets/images/window-cleaner.svg`) + '" alt="*" width="16">'
        case 'Utensílios':
          return '<i class="fa fa-cutlery mr-25"></i>'
      }
      return null
    },
    uniqueUsedFamilies() {
      return [...new Set(this.catalog.map(obj => obj.family))]
    },
    categoriesFromFamily(familyName, collectionName) {
      return [...new Set(this.catalog.filter(obj => (obj.family == familyName && obj.collection == collectionName)).map(obj => obj.category))]
    },
    collectionsFromFamily(familyName) {
      return [...new Set(this.catalog.filter(obj => obj.family == familyName).map(obj => obj.collection))]
    },
    productTypesFromValues(value) {
      var aux = [...new Set(this.catalog.filter(obj => (obj.collection == value.collection && obj.family == value.family && obj.category == value.category)))]
      var result = []
      aux.filter(function(item){
        var i = result.findIndex(x => (x.type.productTypeId == item.type.productTypeId));
        if(i <= -1){
          result.push(item);
        }
        return null;
      })
      return result
    }
  },
  props: {
    openPopup: {
      type: Boolean,
      required: true,
    },
    catalog: {
      type: Array,
      required: true,
    },
    selectedCategory: {
      type: String
    },
    selectedCollection: {
      type: String
    },
    selectedFamily: {
      type: String
    }
  },
  components: {

  },
};
</script>
