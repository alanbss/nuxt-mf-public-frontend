<template>
  <div>
    <div v-if="hasCollections && hasAllTypes">
      <div v-if="!familyPage" class="row mb-2">
        <h4 style="margin-left: 10px;">{{ family.name }}</h4>
      </div>
      <div class="d-flex flex-row flex-wrap mb-2" style="width:calc(100% - 50px)">
        <masonry
        :cols="(familyPage && family.name != 'Alimentos e bebidas') ? {default: 1} : {default: checkMax(collections, 7), 1670: checkMax(collections, 6), 1450: checkMax(collections, 5), 1220: checkMax(collections, 4), 1000: checkMax(collections, 3), 700: checkMax(collections, 2), 470: checkMax(collections, 2)}"
        :gutter="{default: '30px', 470: '2px'}"
        >
        <div
          class="card font-small-3 mb-1 mr-1 "
          v-for="(collection, index) in collections"
          :style="checkWidth(collection, family)"
          :key="'collection' + index"
        >
          <div class="card-header pb-1 p-0">
            <img
              v-if="index.length || family.name != 'Alimentos e bebidas'"
              class="m-0 p-0"
              :style="styleByFamilyAndCollection(family, collection, familyPage)"
              :src="findPictureByName(family, index)"
            >
          </div>
          <div v-if="!familyPage || (familyPage && family.name == 'Alimentos e bebidas')" class="card-body py-0 px-0">
            <h5 class="capitalize-first font-medium-1 ml-1 mr-1">{{ index }}</h5>
            <div v-if="family.name == 'Alimentos e bebidas'">
              <ul class="list-group list-group-flush">
                <li v-for="category in collection" :key="category.id" class="list-group-item">
                  <a
                    href="javascript:void(0)"
                    @click.prevent.stop="openMenu($event, category.id)"
                    class="d-block text-dark"
                  >
                    <i class="fa fa-angle-right float-right"></i>
                    {{ category.name }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="d-flex flex-row" v-else>
              <div v-for="(chunks, index) in chunkedStructure(collection, maxPerColumn)" :key="'collection-chunks' + index" class="card w-100 h-100 m-0">
                <ul class="list-group list-group-flush">
                  <li v-for="category in chunks" :key="category.id" class="list-group-item">
                    <a
                      href="javascript:void(0)"
                      @click.prevent.stop="openMenu($event, category.id)"
                      class="d-block text-dark"
                    >
                      <i class="fa fa-angle-right float-right"></i>
                      {{ category.name }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-else class="card-body py-0 px-0">
            <h5 class="capitalize-first ml-1 mr-1">{{ index }}</h5>
            <div class="d-flex flex-row">
              <div v-for="(chunks, index) in chunkedStructure(collection, maxPerColumnFamilyPage, mobileBrowser)" :key="'collection-chunks' + index" class="card w-100 h-100 m-0">
                <div v-for="category in chunks" :key="category.id">
                  <h6 class="capitalize-first ml-1 mr-1">{{ category.name }}</h6>
                  <ul class="list-group list-group-flush mb-1">
                    <li v-for="type in typesFromCategory(category.id)" :key="type.id" class="list-group-item">
                      <a
                        href="javascript:void(0)"
                        @click.prevent.stop="goToProductPage(type.id)"
                        class="d-block text-dark"
                      >
                        <i class="fa fa-angle-right float-right"></i>
                        {{ type.name }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        </masonry>
        <vue-context ref="menu" style=" min-width:200px">
          <div>
          
          <h6 class="ml-1 mr-1 d-block text-dark" v-if="menuProductTypes.length">
            <i class="feather icon-x float-right"/>
            {{ menuProductTypes[0].categoryName }}
          </h6>
          
          </div>
          <div >
            <div v-for="(chunks, index) in chunkedStructure(menuProductTypes, maxListEntries)" :key="'category-chunks' + index">
              <li v-for="productType in chunks" :key="productType.name" class="ml-1 mr-1" style="margin-top: 5px;">
                <a
                  href="javascript:void(0)"
                  @click.prevent="goToProductPage(productType.id)"
                  class="d-block text-dark"
                >
                  {{ productType.name }}
                </a>
              </li>
            </div>
          </div>
        </vue-context>

        <!-- <span
          v-for="(product, index) in products"
          :key="product.id" :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''"
          class="padding-mobile"
        >
          <product-card v-if="index < maxPerScreen" :product="product" />
        </span> -->
      </div>
    </div>
    <div v-else class="d-flex justify-content-center">
      <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.capitalize-first::first-letter {
  text-transform: uppercase;
}
.mf-item-list a:hover {
  background-color: #F8F8F8;
}
@media only screen and (min-width: 768px) {

  .padding-mobile {
    padding-left: 5px;
  }
}
</style>

<script>
import CategoryService from "@/resources/categories/services";
import FamilyService from "@/resources/families/services";
import ProductTypeService from "@/resources/productTypes/services";
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';
import { mapGetters } from "vuex";
export default {
  name: "FamilyCard",
  data() {
    return {
      categories: {},
      collections: {},
      menuProductTypes: [],
      allProductTypes: [],
      buttonLoading: false,
      collectionPictures: [],
      hasCollections: false,
      hasAllTypes: false,
      maxListEntries: 20,
      maxPerColumn: 8,
      maxPerColumnFamilyPage: 4,
      mobileBrowser: false,
    };
  },
  created() {
    this.isMobile()
  },
  mounted() {
    const ELEMENTS_BY_CATEGORY = 5;
    let params = this.params
    ProductTypeService.usedFromFamilyOptimized(this.family.id, params).then((response) => {
      this.allProductTypes = response.data
      this.hasAllTypes = true
    })
    FamilyService.getUsedWithCategories(this.family.id, params).then((response) => {
      this.collections = response.data.withCollection
      this.collections[''] = response.data.withoutCollection
      this.hasCollections = true
    })
    FamilyService.getCollectionPictures(this.family.id).then((response) => {
      this.collectionPictures = response.data
    })
  },
  computed: {
    ...mapGetters('navigationFilters', ['params']),
    maxPerScreen() {
      if(window.innerWidth >= 1910) {
        return 7
      } else if(window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 6
      } else if(window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 5
      } else if(window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 4
      } else if(window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return 3
      } else if(window.innerWidth >= 770 && window.innerWidth < 1000) {
        return 2
      } else {
        return 2
      }
    },
    widthRatio() {
      if(window.innerWidth >= 768)
        return (((window.innerWidth - 280) / this.maxPerScreen) / (window.innerWidth)) * 100
      else
        return 50
    }
  },
  methods: {
    openMenu(ev, categoryId) {
      this.menuProductTypes = this.allProductTypes.filter(type => type.categoryId == categoryId)
      this.$refs.menu.open(ev)
    },
    goToProductPage(id) {
      this.$router.push({ name: 'product-type', params: { productTypeId: id } })
    },
    toFamily(){
      this.buttonLoading = true
      setTimeout(() => {
        this.buttonLoading = false
        this.$router.push({ name: 'family', params: { familyId: this.family.id } })
      }, 300);
    },
    typesFromCategory(categoryId) {
      return this.allProductTypes.filter(type => type.categoryId == categoryId)
    },
    findPictureByName(family, name) {
      if(family.name != 'Alimentos e bebidas') {
        if(family.imageUrl)
          return family.imageUrl
        else
          return require(`@/assets/images/collection_banner.jpg`)
      } else {
        var found = this.collectionPictures.find(pic => pic.name.toLowerCase() == name.toLowerCase())
        if(found && found.imageUrl)
          return found.imageUrl
        else
          return require(`@/assets/images/collection_banner.jpg`)
      }
    },
    chunkedStructure(structure, max, mobile = false) {
      let totalChunks = [];
      let newMax = max
      if(mobile)
        newMax = Math.ceil(structure.length / 2)
      for (var i = 0; i < structure.length; i += newMax) {
        totalChunks.push(structure.slice(i, i + newMax))
      }
      return totalChunks;
    },
    checkWidth(collection, family) {
      if(this.mobileBrowser) {
        if(this.familyPage && family.name != "Alimentos e bebidas"){
          if(collection.length < 8){
            return 'width: 160px;'
          }else{
            return 'min-width: 340px;'
          }
        }else if(family.name == "Alimentos e bebidas"){
            return 'width: 160px;'
          }
        }
        else if (this.familyPage && family.name != "Alimentos e bebidas"){
          if(collection.length < 8){
            return 'width: 200px;'
          }else{
            return 'min-width: 340px;'
          }
        }
      },




    checkMax(collections, value){
      var keys = Object.keys(collections).length
      if(keys <= value)
        return keys
      else
        return value
    },
    styleByFamilyAndCollection(family, collection, isFamilyPage) {
      // if(family.name == 'Alimentos e bebidas')
      //   return "min-width: 200px; height: 40px; object-fit: cover; object-position: left top;"
      // else if(collection.length > this.maxPerColumn && !isFamilyPage)
      //   return "min-width: 360px; height: 40px; object-fit: cover; object-position: left top;"
      // else if(collection.length > this.maxPerColumnFamilyPage && isFamilyPage)
        return "min-width: 100%; height: 40px; object-fit: cover; object-position: left top;"
      // else
      //   return "min-width: 100%; height: 40px; object-fit: cover; object-position: left top;"
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
  },
  props: {
    family: {
      type: Object,
      required: true,
    },
    products: {
      required: true,
    },
    familyPage: {
      type: Boolean,
    },
  },
  components: {
    VueContext
  },
};
</script>
