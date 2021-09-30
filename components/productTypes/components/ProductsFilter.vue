<template>
  <div class="row">
    <div class="col-12">
      <div class="row" style="padding: 10px 0; background-color: #008567; color: white; font-weight: 450;">
        <div :class="mobileBrowser ? 'col-12' : 'col-12 ml-1'">
          <div ref="collectionLine">
            <span v-if="productType" class="collection-line" style="padding-right: 5px; font-weight: 800;">
              {{ shortName(productType.familyName) }}
            </span>
            <a @click.prevent.stop="$refs.familyMenu.open($event)" style="padding-right: 22px;" class="collection-line" href="javascript:void(0)">
              <span style="text-decoration: underline; color: white;">Mudar</span>
            </a>
            <!-- <span v-for="(collection, index) in collections" :key="'selectedcollection' + index">
              <span
                v-if="index.length > 0 && productType.category.categoriesCollectionName && index == productType.category.categoriesCollectionName.toLowerCase()" class="capitalize-first collection-line is-collection"
                style="display: inline-block; padding-right: 30px;"
                @click.prevent.stop="openCollection($event, collection, index)"
              >
                <b>
                  <a href="javascript:void(0)" style="color: inherit;" class="link-hover">
                    {{ index }}
                  </a>
                </b>
              </span>
            </span>
            <span v-if="collections['']">
              <span v-for="(category, index) in collections['']" :key="'selectednoname' + index" style="display: inline-block;" class="capitalize-first collection-line is-category">
                <span
                  v-if="category.name == productType.category.name"
                  @click.prevent.stop="openCategory($event, category, true)"
                  style="padding-right: 30px;"
                >
                  <b>
                    <a href="javascript:void(0)" style="color: inherit;" class="link-hover">
                      {{ category.name }}
                    </a>
                  </b>
                </span>
              </span>
            </span> -->
            <span v-for="(collection, index) in collections" :key="'othercollections' + index">
              <span
                v-if="index.length > 0 && ((productType.category.categoriesCollectionName && index != productType.category.categoriesCollectionName.toLowerCase()) || !productType.category.categoriesCollectionName)"
                class="pr-1 capitalize-first collection-line is-collection"
                style="display: inline-block;"
                @click.prevent.stop="openCollection($event, collection, index)"
              >
                <a href="javascript:void(0)" style="color: inherit;" class="link-hover">
                  {{ index }}
                </a>
              </span>
            </span>
            <span v-if="collections['']">
              <span v-for="(category, index) in collections['']" :key="'noname' + index" style="display: inline-block;" class="capitalize-first collection-line is-category">
                <span
                  v-if="category.name != productType.category.name"
                  @click.prevent.stop="openCategory($event, category, true)"
                  class="pr-1"
                >
                  <a href="javascript:void(0)" style="color: inherit;" class="link-hover">
                    {{ category.name }}
                  </a>
                </span>
              </span>
            </span>
            <a
              v-if="showMoreCollection"
              @click.prevent.stop="openMoreCollections($event)"
              :class="mobileBrowser ? 'collection-line font-small-3' : 'collection-line'"
              style="text-decoration: underline; color: white;"
              href="javascript:void(0)">Mais</a>
          </div>
        </div>
      </div>

      <vue-context ref="familyMenu">
        <li v-for="family in families" :key="family.name">
          <a class="mf-item-list" v-if="productType && family.name != productType.familyName" @click.prevent="$router.push({ name: 'family', params: { familyId: family.id }})">
            <span v-html="getFamilyIcon(family.name)"></span> {{ family.name }}
          </a>
        </li>
      </vue-context>

      <vue-context ref="itemsMenu" :closeOnClick="false" style="max-height:calc(100% - 150px); min-width:200px;">

        <span v-if="menuView == 'more-collections'">
          <li v-for="collection in moreCollections" :key="'moreCol' + collection.index" class="ml-1 mr-1" style="margin-top: 5px;">
            <vs-button
            color="primary"
            type="flat"
            style="color: inherit; padding-top: 3px; padding-bottom: 3px; text-align: left;"
            @click.prevent="openMoreCollection(collection.name)">
              {{ collection.name }}
            </vs-button>
          </li>
          <li v-for="category in moreCategories" :key="'moreCat' + category.index" class="ml-1 mr-1" style="margin-top: 5px;">
            <vs-button
            color="primary"
            type="flat"
            style="color: inherit; padding-top: 3px; padding-bottom: 3px; text-align: left;"
            @click.prevent="openMoreCategory(category.name)">
              {{ category.name }}
            </vs-button>
          </li>
        </span>

        <span v-if="menuView == 'more-types'">
          <li v-for="type in moreTypes" :key="type.id" class="ml-1 mr-1" style="margin-top: 5px;">
            <vs-button
            color="primary"
            type="flat"
            style="color: inherit; padding-top: 3px; padding-bottom: 3px; text-align: left;"
            @click.prevent="openMoreType(type.name)">
              {{ type.name }}
            </vs-button>
          </li>
        </span>

        <span v-if="menuView == 'collection'">
          <h6 class="ml-1 mr-1 capitalize-first" v-if="menuCollectionName">
            {{ menuCollectionName }}
          </h6>
          <div>
            <div v-for="(chunks, index) in chunkedStructure(menuCollection)" :key="'category-chunks' + index">
              <li v-for="category in chunks" :key="category.name" class="ml-1 mr-1" style="margin-top: 5px;">
                <a
                  href="javascript:void(0)"
                  class="d-block text-dark"
                  @click.prevent="openCategory($event, category, false)"
                >
                  {{ category.name }}
                  <i class="fa fa-angle-right float-right"></i>
                </a>
              </li>
            </div>
          </div>
        </span>

        <span v-if="menuView == 'category'">
          <h6 class="ml-1 mr-1" v-if="menuProductTypes[0]">
            <a v-if="menuProductTypes[0].categoriesCollectionName" @click.prevent="menuView = 'collection'">
              <i class="feather icon-arrow-left"></i>
            </a>
            {{ menuProductTypes[0].categoryName }}
          </h6>
          <div  >
            <div v-for="(chunks, index) in chunkedStructure(menuProductTypes)" :key="'type-chunks' + index">
              <li v-for="type in chunks" :key="type.name" class="ml-1 mr-1" style="margin-top: 5px;">
                <a
                  href="javascript:void(0)"
                  @click.prevent="goToProductPage(type.id)"
                  class="d-block text-dark"
                >
                  {{ type.name }}
                </a>
              </li>
            </div>
          </div>
        </span>
      </vue-context>
      <div class="row" v-if="productType" style="border-top: 2px solid Grey; padding: 10px 0; background-color: #a9eadf;">
        <div :class="mobileBrowser ? 'col-12' : 'col-12 ml-1'">
          <div ref="typeLine">
            <span v-if="productType.category.categoriesCollectionName" class="type-line">
              <span style="display: inline-block;" class="capitalize-first">
                <span
                  style="color: Black; padding-right: 22px;"
                  @click.prevent.stop="openCollection($event, getCategories(productType.category.categoriesCollectionName), productType.category.categoriesCollectionName)"
                >
                  <a href="javascript:void(0)" style="color: inherit;">
                    {{ maxString(productType.category.categoriesCollectionName, 8) }} | {{ maxString(productType.category.name, 10) }}
                    <i class="feather icon-chevron-down"></i>
                  </a>
                </span>
              </span>
            </span>
            <span v-else class="type-line" style="padding-right: 22px; color: black;">
              {{ maxString(productType.category.name, 15) }}
            </span>
            <!-- <span v-for="(type, index) in allProductTypesFromCategory" :key="'selectedtype' + index" style="display: inline-block;" class="capitalize-first">
              <span v-if="type.name == productType.name" class="type-line link-hover" style="padding-right: 30px;">
                <b>
                  <a @click.prevent="goToProductPage(type.id)" style="" class="">
                    {{ type.name }}
                  </a>
                </b>
              </span>
            </span> -->
            <span v-for="(type, index) in allProductTypesFromCategory.filter(obj => obj.name != productType.name)" :key="'othertypes' + index" style="display: inline-block; color: #3b3a3a;" class="capitalize-first">
              <span v-if="type.name != productType.name" class="pr-1 type-line link-hover">
                <a v-if="index == 0" @click.prevent="goToProductPage(type.id)" style="">
                  {{ maxString(type.name, 10) }}
                </a>
                <a v-else @click.prevent="goToProductPage(type.id)" style="">
                  {{ type.name }}
                </a>
              </span>
            </span>
            <a
              v-if="showMoreTypes"
              style="text-decoration: underline; color: black;"
              :class="mobileBrowser ? 'type-line font-small-3' : 'type-line'"
              @click.prevent.stop="openMoreTypes($event)"
              href="javascript:void(0)">Mais</a>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped>
.capitalize-first::first-letter {
  text-transform: uppercase;
}
.link-hover:hover {
    text-decoration: underline;
}
.mf-item-list:active {
  background-color: #ECEDEF;
}
</style>

<script>
import ProductTypeService from "@/resources/productTypes/services";
import FamilyService from "@/resources/families/services";
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "ProductsFilter",
  data() {
    return {
      productTypeId: null,
      collections: [],
      productType: null,
      families: [],
      allProductTypes: [],
      allProductTypesFromCategory: [],
      showMoreCollection: true,
      showMoreTypes: true,
      menuCollection: [],
      menuCollectionName: null,
      menuProductTypes: null,
      menuView: null,
      moreCollections: [],
      moreCategories: [],
      moreTypes: [],
      dropdownKey: 0,
      maxListEntries: 16,
      mobileBrowser: false
    };
  },
  computed: {
    ...mapGetters('navigationFilters', ['params']),
  },
  watch: {

  },
  methods: {
    ...mapActions("productTypes", ["getProducts", "setFilterProductType", "setFilterProperties"]),
    maxString(name, max) {
      if(name.length > max && this.mobileBrowser)
        return name.substring(0, max - 3) + '...'
      else
        return name
    },
    shortName(name) {
      switch(name) {
        case 'Alimentos e bebidas':
          return 'A&B'
        case 'Embalagens':
          return 'Embal.'
        case 'Limpeza':
          return 'Limp.'
        case 'Utensílios':
          return 'Utens.'
      }
    },
    getFamilyIcon(family) {
      switch(family) {
        case 'Alimentos e bebidas':
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
    closeDropdown() {
      this.dropdownKey = Math.random()
    },
    getCategories(collectionName) {
      return this.collections[collectionName.toLowerCase()]
    },
    updateCollectionLine() {
      var elements = document.getElementsByClassName('collection-line')
      var last = null
      var total = elements[elements.length - 1].offsetWidth
      var lineWidth = this.$refs.collectionLine.clientWidth
      var start = 0
      if(elements.length >= 2 && this.mobileBrowser) {
        start = 2
        total += elements[0].offsetWidth + elements[1].offsetWidth
      }
      for(var i = start; i < elements.length; i++) {
        total += elements[i].offsetWidth
        if(total < lineWidth) {
          last = i + 1
        } else {
          break
        }
      }

      for(var j = last; j < elements.length; j++) {
        if(j != (elements.length - 1) && elements[j].innerText != '') {
          elements[j].style.display = 'none';
          if(elements[j].classList.contains('is-collection')) {
            var text = elements[j].innerText.trim()
            var string = text[0].toUpperCase() + text.slice(1)
            this.moreCollections.push({ name: string, index: j })
          } else
            this.moreCategories.push({ name: elements[j].innerText.trim(), index: j })
        }
      }

      if(!this.moreCategories.length && !this.moreCollections.length) {
        this.showMoreCollection = false
      }

      return true
    },
    updateTypeLine() {
      var elements = document.getElementsByClassName('type-line')
      var last = null
      var total = elements[elements.length - 1].offsetWidth
      var lineWidth = this.$refs.typeLine.clientWidth
      var start = 0
      if(elements.length >= 1  && this.mobileBrowser) {
        start = 1
        total += elements[0].offsetWidth
      }
      for(var i = start; i < elements.length; i++) {
        total += elements[i].offsetWidth
        if(total < lineWidth) {
          last = i + 1
        } else {
          break
        }
      }

      for(var j = last; j < elements.length; j++) {
        if(j != (elements.length - 1)) {
          elements[j].style.display = 'none';
          this.moreTypes.push({ name: elements[j].innerText, index: j })
        }
      }

      if(!this.moreTypes.length) {
        this.showMoreTypes = false
      }

      return true
    },
    openMoreCollections(ev) {
      this.menuView = 'more-collections'
      this.$refs.itemsMenu.open(ev)
    },
    openMoreTypes(ev) {
      this.menuView = 'more-types'
      this.$refs.itemsMenu.open(ev)
    },
    openCollection(ev, collection, name) {
      this.menuView = 'collection'
      this.menuCollection = collection
      this.menuCollectionName = name
      this.$refs.itemsMenu.open(ev)
    },
    openMoreCollection(name) {
      this.menuView = 'collection'
      if(this.collections[name.toLowerCase()])
        this.menuCollection = this.collections[name.toLowerCase()]
      else if(this.collections[name])
        this.menuCollection = this.collections[name]
      else
        this.menuCollection = null
      this.menuCollectionName = name
    },
    openCategory(ev, category, triggerMenu = false) {
      this.closeDropdown()
      this.menuView = 'category'
      this.menuProductTypes = this.allProductTypes.filter(type => type.categoryId == category.id)
      if(triggerMenu)
        this.$refs.itemsMenu.open(ev)
    },
    openMoreCategory(name) {
      this.menuView = 'category'
      this.menuProductTypes = this.allProductTypes.filter(type => type.categoryName == name)
    },
    openMoreType(name) {
      var foundType = null
      for(var i = 0; i < this.allProductTypes.length; i++) {
        if(this.allProductTypes[i].name == name.trim() && this.allProductTypes[i].categoryName == this.productType.category.name) {
          foundType = this.allProductTypes[i]
          break
        }
      }
      if(foundType)
        this.goToProductPage(foundType.id)
    },
    goToProductPage(id) {
      this.$router.push({ name: 'product-type', params: { productTypeId: id } })
      window.location.reload()
    },
    chunkedStructure(menuProductTypes) {
      let totalChunks = [];

      for (var i = 0; i < menuProductTypes.length; i += this.maxListEntries) {
        totalChunks.push(menuProductTypes.slice(i, i + this.maxListEntries))
      }
      return totalChunks;
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true
      } else {
        this.mobileBrowser = false
      }
    },
  },
  created() {
    this.isMobile()
    this.productTypeId = this.$route.params.productTypeId
    let params = this.params
    FamilyService.getUsed(params).then((response) => {
      this.families = response.data
    })
    ProductTypeService.get(this.productTypeId).then((producTypeResponse) => {
      this.productType = producTypeResponse.data
      FamilyService.getUsedWithCategories(producTypeResponse.data.familyId, params).then((familyResponse) => {
        this.collections = familyResponse.data.withCollection
        this.collections[''] = familyResponse.data.withoutCollection
        setTimeout(() => {
          this.updateCollectionLine()
          this.updateTypeLine()
        }, 500)
        })
      ProductTypeService.usedFromCategoryViewPage(this.productType.category.id, params).then((response) => {
        this.allProductTypesFromCategory = response.data
      })
      ProductTypeService.usedFromFamilyViewPage(producTypeResponse.data.familyId, params).then((response) => {
        this.allProductTypes = response.data
      })
    })
  },
  mounted() {
  },
  components: {
    VueContext
  }
};
</script>
