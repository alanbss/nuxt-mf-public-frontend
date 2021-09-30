<template>
  <div>
    <store-location-modal
      :openPopup="openLocation"
      :supplier="supplier"
      @allow-zipcode="allowZipcode"
      @update-modal="updateLocationModal"
      v-if="supplier"
    />
    <out-of-region-modal
      :openPopup="outOfRegionModal"
      v-if="supplier"
    />
    <span
      v-if="allowAccess && regionCanAccess && supplier && supplier.user.isAutomatic && supplier.user.supplierStatus == 'Liberado'"
    >
      <span id="hidden-element"></span>
      <!-- <loading-overlay
      :active.sync="isLoading"
      :is-full-page="fullPage"
      :loader="loader"
      :color="color"
      :background-color="backgroundColor"
      :opacity="opacity"
      :width="width"
      :height="height"
      />-->
      <div
        v-if="mobileBrowser"
        class="content-wrapper pb-0 pt-0"
        style="max-height: calc(100vh - 5em); overflow-y: hidden; overflow-x: hidden; padding-right: 3px !important; padding-left: 3px !important;"
      >
        <store-families-modal
          @selected-category="selectedCategoryOnModal"
          @selected-collection="selectedCollectionOnModal"
          @selected-product-type="selectProductType"
          @update-modal="updateStoreFamiliesModal"
          :openPopup="familiesModal"
          :catalog="catalog"
          :selectedFamily="selectedFamily"
          :selectedCategory="selectedCategory"
          :selectedCollection="selectedCollection"
        />
        <div
          class="content-body p-0 m-0"
          v-if="supplier"
          ref="generalScroll"
          style="max-height: calc(100vh - 5.3em); overflow-x: hidden; overflow-y: scroll; scroll-behavior: smooth;"
        >
          <a
            ref="backToTop"
            href="javascript:void(0);"
            @click="scrollToTop()"
            class="position-fixed btn btn-outline-primary font-large-1"
            style="bottom: 20px; right: 15px; z-index: 100; padding: 5px;"
          >
            <i class="feather icon-chevron-up" style="color: Gray;"></i>
          </a>
          <div class style="background: #EDEDED; border-bottom: solid 1px #D5D5D5;">
            <div class="row align-items-center" style="background: white;">
              <div class="col-2 m-0 pl-2 pr-0" style="padding-top: 10px; padding-bottom: 5px;">
                <img
                  v-if="supplier.picture"
                  :src="supplier.picture"
                  alt="*"
                  width="auto"
                  height="45"
                />
                <img
                  v-else
                  :src="require(`~/assets/images/avatar-default.png`)"
                  alt="*"
                  width="auto"
                  height="45"
                />
              </div>
              <div class="col-10 m-0 pr-2" style="padding-top: 10px; padding-bottom: 5px;">
                <span
                  class="m-0 font-weight-bold font-medium-2"
                  style="overflow: hidden !important; text-overflow: ellipsis; max-width: 48vw; display: inline-block; white-space: nowrap; margin-bottom: -6px !important; margin-left: 3px !important;"
                >{{ supplier.user.name }}</span>
                <br />
                <span
                  class="badge badge-pill font-small-2"
                  style="margin-right: 5px; background-color: #b3b3b3;"
                >Min. {{ supplier.minimumOrderValue }}</span>
                <a class href="javascript:void(0);" @click="openSupplierInfo = true" style>Ver mais</a>
                <br />
                <vs-button
                  @click="shareOnWhatsapp()"
                  color="#25D366"
                  type="border"
                  style="padding: 3px 10px; background-color: white; margin-left: 3px; margin-right: 0px; margin-top: 5px;"
                >
                  <i class="fa fa-whatsapp mr-50"></i>Conversar
                </vs-button>
                <a
                  class="font-small-3"
                  :href="'tel:' + supplier.user.phone"
                  style="margin-top: 5px; margin-left: 7px;"
                >{{ supplier.user.phone }}</a>
                <supplier-info-modal
                  :supplier="supplier"
                  :openPopup="openSupplierInfo"
                  @update-popup="updateSupplierPopup"
                />
              </div>
            </div>
            <div
              class="row"
              style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; height: 43px; background: linear-gradient(90deg, rgb(245, 127, 23) 33%, rgb(255, 176, 76) 66%);"
            >
              <form
                @submit.prevent="runSupplierSearch"
                action
                class="row"
                :style="show ? 'width: 100%' : 'display: none;'"
                style="z-index: 1; height: -webkit-fill-available"
              >
                <i
                  class="feather icon-search"
                  style="color: black; position: relative; left: 9%; top: 0px; font-size: 2rem; z-index: 2;"
                  @click="runSupplierSearch()"
                />
                <input
                  id="search"
                  ref="searchBar"
                  type="text"
                  placeholder="Buscar produtos"
                  v-model="keyword"
                  autocomplete="on"
                  style="padding-left: 80px; padding-right: 300px; position: absolute; height: 40px; font-size: 1.2rem; margin-top: -6px;"
                />
                <i
                  class="feather icon-corner-down-left"
                  @click="runSupplierSearch()"
                  style="color: black; position: relative; left: 72%; top: 0px; font-size: 2rem; z-index:9999"
                />
                <i
                  class="feather icon-x"
                  @click="closing()"
                  style="color: black; position: relative; left: 75%; top: 0px; font-size: 2rem; z-index:9999"
                />
              </form>
              <div class="m-0 pl-1 pr-0" v-if="!show" style="flex: 0 0 10%">
                <a id="store-home-button" @click="storeHome()" href="javascript:void(0)">
                  <button
                    type="button"
                    :class="viewType == home ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary'"
                    style="padding: 7px 7px;"
                  >
                    <i class="ficon feather icon-home" />
                  </button>
                </a>
              </div>
              <div
                class="m-0"
                v-if="!show"
                style="flex: 0 0 40%;; padding-right: 2px !important; padding-left: 2px;"
              >
                <button
                  @click="openFamiliesModal()"
                  type="button"
                  :class="(viewType == home || viewType == 'sale') ? 'btn btn-warning w-100' : 'btn btn-outline-warning bg-white w-100'"
                  style="padding: 8px 3px;"
                >Categorias</button>
              </div>
              <div
                class="m-0 pl-0 pr-0"
                v-if="!show && supplierOfferProducts && supplierOfferProducts.length"
                style="flex: 0 0 10%%;"
              >
                <button
                  @click="closing()"
                  type="button"
                  class="btn btn-outline-primary"
                  style="padding: 7px 7px;"
                >
                  <i class="ficon feather icon-search" style="color: inherit;"></i>
                </button>
              </div>
              <div
                class="m-0 pl-0 pr-1"
                v-if="!show && supplierOfferProducts && supplierOfferProducts.length"
                style="flex: 0 0 40%;"
              >
                <button
                  @click="goToOffers()"
                  type="button"
                  class="btn btn-danger w-100"
                  style="padding: 7px 2px;"
                >
                  <img :src="require(`~/assets/images/offers.png`)" alt="*" width="16" height="16" />
                  <span class="font-small-3 align-middle">Ver ofertas</span>
                </button>
              </div>
              <div
                class="m-0 pl-0 pr-1"
                v-if="!supplierOfferProducts || !supplierOfferProducts.length"
                style="flex: 0 0 48%;"
              >
                <form
                  @submit.prevent="runSupplierSearch"
                  action
                  class
                  style="width: 100%; z-index: 1; height: -webkit-fill-available; position: relative;"
                >
                  <i
                    class="feather icon-search"
                    style="color: black; position: absolute; left: 3px; top: 7px; font-size: 1.2rem; z-index: 2;"
                    @click="runSupplierSearch()"
                  />
                  <input
                    id="search2"
                    type="text"
                    placeholder="Buscar produtos"
                    v-model="keyword"
                    autocomplete="on"
                    class="mr-2"
                    style="padding-left: 20px; position: relative; left: 0; width: 97%; height: 30px; font-size: 1rem;"
                  />
                </form>
              </div>
            </div>
            <div
              v-if="selectedCollection || selectedCategory"
              ref="mobileCollectionChips"
              class="row no-wrap"
              style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
            >
              <span
                v-for="(collection, index) in collectionsFromFamily(selectedFamily)"
                :key="index"
                :vs-value="index"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip v-if="index != selectedCollection" class="chip-mf public-chip p-0 pr-1">
                  <a
                    @click="selectedCollectionOnModal({ family: selectedFamily, collection: index })"
                    style
                  >{{ index }}</a>
                </vs-chip>
                <vs-chip
                  v-if="index == selectedCollection"
                  style="flex: 0 0 auto; width: auto; background-color: #ffb04c;"
                  class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
                >
                  <a
                    @click="selectedCollectionOnModal({ family: selectedFamily, collection: index })"
                    style
                  >{{ index }}</a>
                </vs-chip>
              </span>
              <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
            </div>
            <div
              v-if="(selectedCollection || selectedCategory)"
              ref="mobileCategoryChips"
              class="row no-wrap"
              style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
            >
              <vs-chip
                v-if="selectedCollection"
                style="margin-left: 5px; background-color: #f57f17;"
                class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
              >
                <router-link
                  :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(selectedFamily) } }"
                  style="color: inherit;"
                >{{ selectedCollection }}</router-link>
              </vs-chip>
              <div
                v-if="selectedCollection"
                style="border-right: 1px solid DarkGrey; margin: 0 5px;"
              ></div>
              <span
                v-for="(category, index) in categoriesFromCollection(selectedFamily, selectedCollection)"
                :key="index"
                :vs-value="index"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip
                  v-if="index == selectedCategory"
                  style="flex: 0 0 auto; width: auto; background-color: #ffb04c;"
                  class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
                >
                  <a
                    @click="selectedCollectionOnModal({ family: selectedFamily, collection: selectedCollection })"
                    style
                  >{{ selectedCategory }}</a>
                </vs-chip>
                <vs-chip v-if="index != selectedCategory" class="chip-mf public-chip p-0 pr-1">
                  <router-link
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(index) } }"
                    style="color: inherit;"
                  >{{ index }}</router-link>
                </vs-chip>
              </span>
              <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
            </div>

            <div
              v-if="viewType == 'collection' && selectedFamily != 'Alimentos e bebidas'"
              ref="mobileFamilyChips"
              class="row no-wrap"
              style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
            >
              <span v-html="getFamilyIcon(selectedFamily)"></span>
              <span
                v-for="(category, index) in categoriesFromCollection(selectedFamily, '')"
                :key="index"
                :vs-value="index"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip v-if="index != selectedCategory" class="chip-mf public-chip p-0 pr-1">
                  <router-link
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(index) } }"
                    style="color: inherit;"
                  >{{ index }}</router-link>
                </vs-chip>
              </span>
            </div>
            <div
              v-if="viewType == 'category-all-products'"
              class="row"
              style="border-top: solid 1px LightGrey; padding-top: 2px; padding-bottom: 2px; padding-left: 15px;"
            >
              <div class="col-7 p-0 m-0">
                <h5 style="margin-top: 10px; margin-left: 3px;">{{ selectedCategory }}</h5>
              </div>
              <div class="col-5 p-0 m-0 pr-1">
                <b-form-select
                  v-model="navigateToProduct"
                  @input="selectProductType(navigateToProduct)"
                  :options="productsFromCategory(selectedCategory, selectedFamily, selectedCollection)"
                ></b-form-select>
              </div>
            </div>
            <div
              v-if="viewType == 'product-type'"
              class="row pr-1"
              style="border-top: solid 1px LightGrey; padding-left: 10px;"
            >
              <div class="col-8 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px;">
                <h5 class style="margin: 0;">
                  <!-- <router-link
                    v-if="selectedFamily != 'Alimentos e bebidas'"
                    style="color: black;"
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                  >
                    <i class="feather icon-chevron-left"></i>
                  </router-link> -->
                  <router-link
                    style="color: black;"
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                  >
                    <i class="feather icon-chevron-left"></i>
                  </router-link>
                  {{ selectedProductType.productType }}
                </h5>
              </div>
              <div class="col-4 m-0 p-0 float-right">
                <div
                  class="d-flex justify-content-end"
                  v-if="productsFromType(selectedProductType).length > 1 || hasFilters(selectedProductType)"
                >
                  <div
                    style="padding: 0.75rem 0.35rem; background-color: white; border-radius: 0.5rem;"
                  >
                    <a
                      style="border-bottom: 1px solid grey; padding-bottom: 1px; color: grey; margin-right: 10px;"
                      class="font-small-1"
                      @click="clearAllFilters()"
                      v-if="hasFilters(selectedProductType)"
                    >Limpar</a>
                    <span class="dot" v-if="hasFilters(selectedProductType)"></span>
                    <a
                      style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;"
                      class="font-small-3"
                      @click="clickSidebar(selectedProductType)"
                    >Filtrar</a>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="viewType == 'sale'"
              class="row pr-1"
              style="border-top: solid 1px LightGrey; padding-left: 10px;"
            >
              <div class="col-12 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px;">
                <h5 class style="margin: 0;">Ofertas</h5>
              </div>
            </div>
          </div>
          <div v-if="catalog" class="row p-0 m-0" style="display: contents;">
            <div class="col-12 p-0 m-0" style id="products">
              <div>
                <div class="vh-100" ref="desktopScroll">
                  <div class="mb-2">
                    <div></div>
                    <div>
                      <!-- visao por familia -->
                      <div v-if="viewType == 'family'" style>
                        <div
                          style="overflow-x: scroll;"
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a href="javascript:void(0)" @click="goToOffers()">Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399; overflow-x: scroll; width: ' + calcWidth(supplierOfferProducts.slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in supplierOfferProducts.slice(0, 6)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-for="(family, index) in catalog"
                          :key="'family-' + index"
                          style="background-color: #fbfdfe; overflow-x: scroll; "
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4 class style="margin: 0; padding-left: 5px;">{{ index }}</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <router-link
                                v-if="index == 'Alimentos e bebidas'"
                                :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(index) } }"
                                style="color: inherit;"
                              >Ver tudo</router-link>
                              <router-link
                                v-else
                                :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(index) } }"
                                style="color: inherit;"
                              >Ver tudo</router-link>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'margin-top: 10px; overflow-x: scroll; width: ' + calcWidth(productsFromFamily(index).slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in productsFromFamily(index).slice(0, 6)"
                              :key="'product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="product.supplierProductExpeditions"
                                    :loadedTotals="totals"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="productsFromFamily(index).length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <router-link
                                      :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(index) } }"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </router-link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao da familia alim e bebidas -->
                      <div v-if="viewType == 'family-collections'" ref="familyScroll" style>
                        <div
                          style="overflow-x: scroll;"
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a href="javascript:void(0)" @click="goToOffers()">Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399; overflow-x: scroll; width: ' + calcWidth(supplierOfferProducts.slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in supplierOfferProducts.slice(0, 6)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-for="collection in collectionProducts"
                          :key="'collection-' + collection.collection"
                          style="background-color: #fbfdfe; overflow-x: scroll; "
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px;"
                              >{{ collection.collection }}</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <a
                                href="javascript:void(0)"
                                @click="selectedCollectionOnModal({ family: selectedFamily, collection: collection.collection })"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'margin-top: 10px; overflow-x: scroll; width: ' + calcWidth(collection.products.slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in collection.products.slice(0, 6)"
                              :key="'product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="product.supplierProductExpeditions"
                                    :loadedTotals="totals"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="collection.products.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="selectedCollectionOnModal({ family: selectedFamily, collection: collection.collection })"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por colecao -->
                      <div v-if="viewType == 'collection'" ref="collectionScroll" style>
                        <div
                          style="overflow-x: scroll;"
                          ref="collectionOffers"
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a href="javascript:void(0)" @click="goToOffers()">Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399; overflow-x: scroll; width: ' + calcWidth(supplierOfferProducts.slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in supplierOfferProducts.slice(0, 6)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div ref="collectionCategories">
                          <div
                            v-for="category in categoryProducts"
                            :key="'category-' + category.category"
                            style="background-color: #fbfdfe;"
                          >
                            <div
                              class="row mt-1 mb-1 m-0"
                              style="background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                            >
                              <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                                <h4
                                  class
                                  style="margin: 0; padding-left: 5px;"
                                >{{ category.category }}</h4>
                              </div>
                              <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                                <!-- <a
                                  v-if="selectedFamily == 'Alimentos e bebidas'"
                                  href="javascript:void(0)"
                                  @click="selectedCategoryAllProducts({ family: selectedFamily, category: category.category, collection: selectedCollection })"
                                >Ver tudo</a> -->
                                <router-link
                                  :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                  style="color: inherit;"
                                >Ver tudo</router-link>
                              </div>
                            </div>
                            <div
                              class="row justify-content-center pl-1"
                              style="overflow-x: hidden; margin-top: 10px;"
                            >
                              <div class="col-12 p-0 m-0">
                                <div
                                  class="row justify-content-center"
                                  style="margin-top: 10px; overflow-x: hidden;"
                                >
                                  <span
                                    v-for="product in category.products.slice(0, 12)"
                                    :key="'product' + product.id"
                                    style="width: 170px;"
                                    :id="'scrollTo' + product.productTypeId + '-' + product.id"
                                  >
                                    <div style="padding-left: 5px;">
                                      <h6 style="margin-bottom: 10px;">
                                        <a
                                          @click="clickedProductTitle(product)"
                                          style="text-decoration: underline;"
                                        >{{ product.productTypeName }}</a>
                                      </h6>
                                    </div>
                                    <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                      <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                        <PublicStoreProductCard
                                          :product="product"
                                          :expeditions="product.supplierProductExpeditions"
                                          :loadedTotals="totals"
                                          @quantity-input="checkTotals"
                                          @remove-item="removeFromCart"
                                          @fill-location="openLocationPopup"
                                        />
                                      </div>
                                    </div>
                                  </span>
                                  <div
                                    class="card font-small-3"
                                    v-if="category.products.length >= 12"
                                    style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                                  >
                                    <div class="card-body p-1">
                                      <div class="row">
                                        <div
                                          class="col-12 text-center"
                                        >Veja mais produtos deste tipo.</div>
                                        <div class="col-12 mt-1">
                                          <!-- <button
                                            v-if="selectedFamily == 'Alimentos e bebidas'"
                                            href="javascript:void(0)"
                                            @click="selectedCategoryAllProducts({ family: selectedFamily, category: category.category, collection: selectedCollection })"
                                            type="button"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span class="font-medium-1 align-middle">Ver tudo</span>
                                          </button> -->
                                          <router-link
                                            :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span class="font-medium-1 align-middle">Ver tudo</span>
                                          </router-link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por categoria -->
                      <div v-if="viewType == 'category'" ref="categoryScroll" style>
                        <div
                          style="overflow-x: scroll;"
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a href="javascript:void(0)" @click="goToOffers()">Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399; overflow-x: scroll; width: ' + calcWidth(supplierOfferProducts.slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in supplierOfferProducts.slice(0, 6)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-for="type in typeProducts"
                          :key="'type-' + type.type.productTypeId"
                          style="background-color: #fbfdfe; overflow-x: scroll; "
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px;"
                              >{{ type.type.productType }}</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <router-link
                                :to="{ name: 'public-store-product',
                                       params: { supplierSlug: slug,
                                                 familyName: formatString(selectedFamily),
                                                 categoryName: formatString(selectedCategory),
                                                 productTypeName: formatString(type.type.productType) } }"
                                style="color: inherit;"
                              >Ver tudo</router-link>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'margin-top: 10px; overflow-x: scroll; width: ' + calcWidth(type.products.slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in type.products.slice(0, 6)"
                              :key="'product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="product.supplierProductExpeditions"
                                    :loadedTotals="totals"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="type.products.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <router-link
                                      :to="{ name: 'public-store-product',
                                             params: { supplierSlug: slug,
                                                       familyName: formatString(selectedFamily),
                                                       categoryName: formatString(selectedCategory),
                                                       productTypeName: formatString(type.type.productType) } }"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </router-link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-4 mb-4"></div>
                      </div>
                      <!-- visao por categoria com todos os produtos -->
                      <div v-if="viewType == 'category-all-products'" ref="categoryAllScroll" style>
                        <div
                          style="overflow-x: scroll;"
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a href="javascript:void(0)" @click="goToOffers()">Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399; overflow-x: scroll; width: ' + calcWidth(supplierOfferProducts.slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in supplierOfferProducts.slice(0, 6)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="row justify-content-center pl-1"
                          style="background-color: #fbfdfe; overflow-x: hidden;"
                        >
                          <div class="col-12 p-0 m-0">
                            <div
                              class="row justify-content-center"
                              style="margin-top: 10px; padding-bottom: 10rem; overflow-x: hidden;"
                            >
                              <span
                                v-for="product in supplierProducts"
                                :key="'product' + product.id"
                                style="width: 170px;"
                                :id="'scrollTo' + product.productTypeId + '-' + product.id"
                              >
                                <div style="padding-left: 5px;">
                                  <h6 style="margin-bottom: 10px;">
                                    <a
                                      @click="clickedProductTitle(product)"
                                      style="text-decoration: underline;"
                                    >{{ product.productTypeName }}</a>
                                  </h6>
                                </div>
                                <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                    <PublicStoreProductCard
                                      :product="product"
                                      :expeditions="product.supplierProductExpeditions"
                                      :loadedTotals="totals"
                                      @quantity-input="checkTotals"
                                      @remove-item="removeFromCart"
                                      @fill-location="openLocationPopup"
                                    />
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <div
                        v-if="viewType == 'product-type'"
                        ref="typeScroll"
                        style="background-color: #fbfdfe; padding-bottom: 5em;"
                      >
                        <div
                          style="overflow-x: scroll;"
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a href="javascript:void(0)" @click="goToOffers()">Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399; overflow-x: scroll; width: ' + calcWidth(supplierOfferProducts.slice(0, 6).length) + 'px;'"
                          >
                            <span
                              v-for="product in supplierOfferProducts.slice(0, 6)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length >= 6"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="row justify-content-center pl-1"
                          v-for="(chunck, index) in productChunks(productsFromType(selectedProductType))"
                          :key="index"
                          style="margin-top: 10px; overflow-x: hidden;"
                        >
                          <span
                            v-for="product in chunck"
                            :key="'product' + product.id"
                            style="width: 170px;"
                            :id="'scrollTo' + product.productTypeId + '-' + product.id"
                          >
                            <div style="padding-left: 5px;">
                              <h6 style="margin-bottom: 10px;">
                                <span>{{ product.productTypeName }}</span>
                              </h6>
                            </div>
                            <div
                              class="card font-small-3 mb-1"
                              style="margin-right: 10px;"
                              v-if="expeditionsByProduct(product).length"
                            >
                              <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                <PublicStoreProductCard
                                  :product="product"
                                  :expeditions="expeditionsByProduct(product)"
                                  :loadedTotals="totals"
                                  @quantity-input="checkTotals"
                                  @remove-item="removeFromCart"
                                  @fill-location="openLocationPopup"
                                />
                              </div>
                            </div>
                          </span>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <div
                        v-if="viewType == 'sale'"
                        ref="saleScroll"
                        style="background-color: #fbfdfe; padding-bottom: 5em;"
                      >
                        <div class="row pl-1" style="margin-top: 10px;">
                          <span
                            v-for="product in supplierOfferProducts"
                            :key="'product' + product.id"
                            :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''"
                            :id="'scrollTo' + product.productTypeId + '-' + product.id"
                          >
                            <div style="padding-left: 5px;">
                              <h6 style="margin-bottom: 10px;">
                                <a
                                  @click="clickedProductTitle(product)"
                                  style="text-decoration: underline;"
                                >{{ product.productTypeName }}</a>
                              </h6>
                            </div>
                            <div
                              class="card font-small-3 mb-1"
                              style="margin-right: 10px;"
                              v-if="offerExpeditionsByProduct(product).length"
                            >
                              <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                <PublicStoreProductCard
                                  :product="product"
                                  :expeditions="offerExpeditionsByProduct(product)"
                                  :loadedTotals="totals"
                                  @quantity-input="checkTotals"
                                  @remove-item="removeFromCart"
                                  @fill-location="openLocationPopup"
                                />
                              </div>
                            </div>
                          </span>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <filters-sidebar-store
              ref="filtersVertical"
              :openSidebar="openSidebar"
              :products="filtersProducts"
              @update-sidebar="updateSidebar"
              @update-products="updateProductsByFilters"
              @apply-filters="applyFilters"
              @clear-filters="clearFilters"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="content-wrapper pb-0"
        style="padding-left: 5px; padding-right: 5px; padding-top: 3px;"
      >
        <store-families-modal
          @selected-category="selectedCategoryOnModal"
          @selected-collection="selectedCollectionOnModal"
          @selected-product-type="selectProductType"
          @update-modal="updateStoreFamiliesModal"
          :openPopup="familiesModal"
          :catalog="catalog"
          :selectedFamily="selectedFamily"
          :selectedCategory="selectedCategory"
          :selectedCollection="selectedCollection"
        />
        <div
          class="content-body p-0 m-0"
          v-if="supplier"
          ref="generalScroll"
          style="max-height: calc(100vh - 5em); overflow-y: scroll; overflow-x: hidden; scroll-behavior: smooth;"
        >
          <div
            class
            style="background: #EDEDED; border-bottom: solid 1px #D5D5D5; padding-top: 0px; padding-bottom: 5px;"
          >
            <a
              ref="backToTop"
              href="javascript:void(0);"
              @click="scrollToTop()"
              class="position-fixed btn btn-outline-primary font-large-1"
              style="bottom: 20px; right: 30px; z-index: 100; padding: 8px;"
            >
              <i class="feather icon-chevron-up" style="color: Gray;"></i>
            </a>
            <div class="row" style="padding: 5px 20px; background-color: white;">
              <div class="col-1 m-0 p-0 text-center">
                <img
                  v-if="supplier.picture"
                  :src="supplier.picture"
                  alt="*"
                  width="auto"
                  height="45"
                />
                <img
                  v-else
                  :src="require(`~/assets/images/avatar-default.png`)"
                  alt="*"
                  width="auto"
                  height="45"
                />
              </div>
              <div class="col-7 m-0 p-0">
                <h3 class="m-0 font-weight-bold">{{ supplier.user.name }}</h3>
                <a :href="'tel:' + supplier.user.phone">{{ supplier.user.phone }}</a>
                <vs-button
                  @click="shareOnWhatsapp()"
                  color="#25D366"
                  type="border"
                  style="padding: 3px 10px; background-color: white; margin-left: 3px; margin-right: 3px;"
                >
                  <i class="fa fa-whatsapp mr-50"></i>Conversar
                </vs-button>
                <a href="javascript:void(0);" @click="openSupplierInfo = true">Ver mais</a>
                <supplier-info-modal
                  :supplier="supplier"
                  :openPopup="openSupplierInfo"
                  @update-popup="updateSupplierPopup"
                />
              </div>
              <div class="col-4 m-0 p-0">
                <div class="row">
                  <div class="col-12">
                    <span
                      class="badge badge-pill float-right font-small-3"
                      style="background-color: #b3b3b3;"
                    >Min. {{ supplier.minimumOrderValue }}</span>
                  </div>
                </div>
                <div class="row" style="margin-top: 5px;">
                  <div class="col-12">
                    <span
                      class="badge badge-pill float-right font-small-3"
                      style="background-color: #b3b3b3;"
                      v-if="!supplier.deliveryEstimate"
                    >Não faz entrega</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="row"
              style="border-top: solid 1px LightGrey; padding: 5px 10px; background-color: #f5f6f7; height: 43px; background: linear-gradient(90deg, rgb(245, 127, 23) 33%, rgb(255, 176, 76) 66%);"
            >
              <div class="m-0 pl-1 pr-0" style="flex: 0 0 50px">
                <a id="store-home-button" @click="storeHome()" href="javascript:void(0)">
                  <button
                    type="button"
                    :class="viewType == home ? 'btn btn-outline-primary disabled' : 'btn btn-outline-primary'"
                    style="padding: 7px 7px;"
                  >
                    <i class="ficon feather icon-home" />
                  </button>
                </a>
              </div>
              <div
                class="m-0"
                style="flex: 0 0 auto; padding-right: 2px !important; padding-left: 2px;"
              >
                <span
                  v-for="(family, index) in catalog"
                  :key="index"
                  style="flex: 0 0 auto; width: auto; color: black;"
                >
                  <vs-chip
                    v-if="index == selectedFamily"
                    style="flex: 0 0 auto; width: auto; background-color: #bc5100;"
                    class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
                  >
                    <a @click="storeHome()" style>
                      <span v-html="getFamilyIcon(selectedFamily)"></span>
                      {{ selectedFamily }}
                    </a>
                  </vs-chip>
                  <vs-chip v-if="index != selectedFamily" class="chip-mf public-chip p-0 pr-1">
                    <router-link
                      v-if="index == 'Alimentos e bebidas'"
                      :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(index) } }"
                      style="color: inherit;"
                    >
                      <span v-html="getFamilyIcon(index)"></span>
                      {{ index }}
                    </router-link>
                    <router-link
                      v-else
                      :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(index) } }"
                      style="color: inherit;"
                    >
                      <span v-html="getFamilyIcon(index)"></span>
                      {{ index }}
                    </router-link>
                  </vs-chip>
                </span>
              </div>
              <div class="m-0 pl-0 pr-1" style="flex: 0 0 350px; margin-left: auto !important;">
                <form
                  @submit.prevent="runSupplierSearch"
                  action
                  class
                  style="width: 100%; z-index: 1; height: -webkit-fill-available; position: relative;"
                >
                  <i
                    class="feather icon-search"
                    style="color: black; position: absolute; left: 3px; top: 7px; font-size: 1.2rem; z-index: 2;"
                    @click="runSupplierSearch()"
                  />
                  <input
                    id="search2"
                    type="text"
                    placeholder="Buscar neste fornec."
                    v-model="keyword"
                    autocomplete="on"
                    class="mr-2"
                    style="padding-left: 20px; position: relative; left: 0; width: 97%; height: 30px; font-size: 1rem;"
                  />
                </form>
              </div>
              <div
                class="m-0 pl-0 pr-1"
                v-if="supplierOfferProducts && supplierOfferProducts.length"
                style="flex: 0 0 170px;"
              >
                <button
                  @click="goToOffers()"
                  type="button"
                  class="btn btn-danger w-100"
                  style="padding: 7px 2px;"
                >
                  <img :src="require(`~/assets/images/offers.png`)" alt="*" width="16" height="16" />
                  <span class="font-small-3 align-middle">Ver ofertas</span>
                </button>
              </div>
            </div>

            <div
              ref="scrollCollections"
              class="row no-wrap no-scrollbar"
              v-if="selectedFamily && selectedFamily == 'Alimentos e bebidas'"
              @mousewheel="scrollXCollections"
              v-dragscroll
              style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
            >
              <a
                href="javascript:void(0);"
                v-if="hasScroll($refs.scrollCollections)"
                @click="addScrollX($refs.scrollCollections, -1)"
                class="btn btn-outline-primary font-medium-1"
                style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
              >
                <i class="feather icon-chevron-left" style="color: Gray;"></i>
              </a>

              <span
                v-for="(collection, index) in collectionsFromFamily(selectedFamily)"
                :key="index"
                :vs-value="index"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip v-if="index != selectedCollection" class="chip-mf public-chip p-0 pr-1">
                  <a
                    @click="selectedCollectionOnModal({ family: selectedFamily, collection: index })"
                    style
                  >{{ index }}</a>
                </vs-chip>
                <vs-chip
                  v-if="index == selectedCollection"
                  style="flex: 0 0 auto; width: auto; background-color: #ffb04c;"
                  class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
                >
                  <a
                    @click="selectedCollectionOnModal({ family: selectedFamily, collection: index })"
                    style
                  >{{ index }}</a>
                </vs-chip>
              </span>
              <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
              <a
                href="javascript:void(0);"
                v-if="hasScroll($refs.scrollCollections)"
                @click="addScrollX($refs.scrollCollections, 1)"
                class="btn btn-outline-primary font-medium-1"
                style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
              >
                <i class="feather icon-chevron-right" style="color: Gray;"></i>
              </a>
            </div>
            <div
              v-if="(selectedCollection || selectedCategory)"
              ref="scrollCategories"
              class="row no-wrap no-scrollbar"
              @mousewheel="scrollXCategories"
              v-dragscroll
              style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
            >
              <a
                href="javascript:void(0);"
                v-if="hasScroll($refs.scrollCategories)"
                @click="addScrollX($refs.scrollCategories, -1)"
                class="btn btn-outline-primary font-medium-1"
                style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
              >
                <i class="feather icon-chevron-left" style="color: Gray;"></i>
              </a>

              <a
                v-if="selectedCollection"
                style="margin-left: 5px;     align-self: center;"
                class="public-chip text-black font-small-2 font-weight-bold p-0 pr-1"
              >
                <router-link
                  :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(selectedFamily) } }"
                  style="color: inherit;"
                >{{ selectedCollection }}</router-link>
              </a>
              <div
                v-if="selectedCollection"
                style="border-right: 1px solid DarkGrey; margin: 0 5px;"
              ></div>
              <span
                v-for="(category, index) in categoriesFromCollection(selectedFamily, selectedCollection)"
                :key="index"
                :vs-value="index"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip
                  v-if="index == selectedCategory"
                  style="flex: 0 0 auto; width: auto; background-color: #f57f17;"
                  class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
                >
                  <router-link
                    v-if="viewType == 'product-type'"
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(index) } }"
                    style="color: inherit;"
                  >{{ selectedCategory }}</router-link>
                  <a
                    v-else
                    @click="selectedCollectionOnModal({ family: selectedFamily, collection: selectedCollection })"
                    style
                  >{{ selectedCategory }}</a>
                </vs-chip>
                <vs-chip v-if="index != selectedCategory" class="chip-mf public-chip p-0 pr-1">
                  <router-link
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(index) } }"
                    style="color: inherit;"
                  >{{ index }}</router-link>
                </vs-chip>
              </span>
              <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
              <a
                href="javascript:void(0);"
                v-if="hasScroll($refs.scrollCategories)"
                @click="addScrollX($refs.scrollCategories, 1)"
                class="btn btn-outline-primary font-medium-1"
                style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
              >
                <i class="feather icon-chevron-right" style="color: Gray;"></i>
              </a>
            </div>
            <div
              v-if="viewType == 'collection' && selectedFamily != 'Alimentos e bebidas'"
              ref="scrollCategoriesAB"
              class="row no-wrap no-scrollbar"
              @mousewheel="scrollXCategoriesAB"
              v-dragscroll
              style="border-top: solid 1px LightGrey; padding-top: 5px; padding-bottom: 5px; padding-left: 17px; overflow-x: scroll; background-color: #f5f6f7;"
            >
              <a
                href="javascript:void(0);"
                v-if="hasScroll($refs.scrollCategoriesAB)"
                @click="addScrollX($refs.scrollCategoriesAB, -1)"
                class="btn btn-outline-primary font-medium-1"
                style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
              >
                <i class="feather icon-chevron-left" style="color: Gray;"></i>
              </a>
              <span v-html="getFamilyIcon(selectedFamily)"></span>
              <span
                v-for="(category, index) in categoriesFromCollection(selectedFamily, '')"
                :key="index"
                :vs-value="index"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip v-if="index != selectedCategory" class="chip-mf public-chip p-0 pr-1">
                  <router-link
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(index) } }"
                    style="color: inherit;"
                  >{{ index }}</router-link>
                </vs-chip>
              </span>
              <a
                href="javascript:void(0);"
                v-if="hasScroll($refs.scrollCategoriesAB)"
                @click="addScrollX($refs.scrollCategoriesAB, 1)"
                class="btn btn-outline-primary font-medium-1"
                style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
              >
                <i class="feather icon-chevron-right" style="color: Gray;"></i>
              </a>
            </div>
            <div
              v-if="viewType == 'category-all-products' || viewType == 'product-type'"
              ref="scrollProducts"
              class="row no-wrap no-scrollbar"
              style="overflow-x: scroll; border-top: solid 1px LightGrey; padding-top: 2px; padding-bottom: 2px; padding-left: 15px; background-color: #f5f6f7;"
              @mousewheel="scrollXProducts"
              v-dragscroll
            >
              <a
                href="javascript:void(0);"
                v-if="hasScroll($refs.scrollProducts)"
                @click="addScrollX($refs.scrollProducts, -1)"
                class="btn btn-outline-primary font-medium-1"
                style="position: sticky; left: 0px; z-index: 100; padding: 5px; height: 25px;"
              >
                <i class="feather icon-chevron-left" style="color: Gray;"></i>
              </a>
              <span
                v-for="type in productsFromCategory(selectedCategory, selectedFamily, selectedCollection, true)"
                :key="type.text"
                :vs-value="type.text"
                style="flex: 0 0 auto; width: auto;"
              >
                <vs-chip
                  v-if="selectedProductType && type.value == selectedProductType.productTypeId"
                  style="flex: 0 0 auto; width: auto; background-color: #ffb04c;"
                  class="public-chip text-white font-small-2 font-weight-bold p-0 pr-1"
                >
                  <router-link
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                    style="color: inherit;"
                  >{{ type.text }}</router-link>
                </vs-chip>
                <vs-chip v-else class="chip-mf public-chip p-0 pr-1">
                  <router-link
                    :to="{ name: 'public-store-product',
                           params: { supplierSlug: slug,
                                     familyName: formatString(selectedFamily),
                                     categoryName: formatString(selectedCategory),
                                     productTypeName: formatString(type.text) } }"
                    style="color: inherit;"
                  >
                    {{ type.text }}
                  </router-link>
                </vs-chip>
              </span>
              <vs-chip class="chip-mf public-chip p-0 pr-1" style="visibility: hidden;">a</vs-chip>
              <a
                href="javascript:void(0);"
                v-if="hasScroll($refs.scrollProducts)"
                @click="addScrollX($refs.scrollProducts, 1)"
                class="btn btn-outline-primary font-medium-1"
                style="position: sticky; right: 20px; z-index: 100; padding: 5px; height: 25px;"
              >
                <i class="feather icon-chevron-right" style="color: Gray;"></i>
              </a>
            </div>
            <div
              v-if="viewType == 'product-type'"
              class="row pr-1"
              style="border-top: solid 1px LightGrey; padding-left: 10px;"
            >
              <div class="col-8 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px;">
                <span class="font-medium-1" style="margin: 0;">
                  <router-link
                    v-if="selectedFamily != 'Alimentos e bebidas'"
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                    style="color: inherit;"
                  >
                    <i class="feather icon-chevron-left"></i> Voltar
                  </router-link>
                  <router-link
                    v-else
                    :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(selectedCategory) } }"
                    style="color: inherit;"
                  >
                    <i class="feather icon-chevron-left"></i> Voltar
                  </router-link>
                </span>
                <span
                  class="font-medium-2 font-weight-bold ml-1"
                >{{ selectedProductType.productType }}</span>
              </div>
              <div class="col-4 m-0 p-0 float-right">
                <div
                  class="d-flex justify-content-end"
                  v-if="productsFromType(selectedProductType).length > 1 || hasFilters(selectedProductType)"
                >
                  <div
                    style="padding: 0.75rem 1rem; background-color: white; border-radius: 0.5rem;"
                  >
                    <a
                      style="border-bottom: 1px solid grey; padding-bottom: 1px; color: grey; margin-right: 10px;"
                      class="font-small-3"
                      @click="clearAllFilters()"
                      v-if="hasFilters(selectedProductType)"
                    >Limpar</a>
                    <span class="dot" v-if="hasFilters(selectedProductType)"></span>
                    <a
                      style="border-bottom: 1px solid #007bff; padding-bottom: 1px; color: #007bff;"
                      class="font-medium-2"
                      @click="clickSidebar(selectedProductType)"
                    >Filtrar {{ selectedProductType.productType }}</a>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="viewType == 'sale'"
              class="row pr-1"
              style="border-top: solid 1px LightGrey; padding-left: 10px;"
            >
              <div class="col-12 m-0 pr-0 pt-1 pl-1" style="padding-bottom: 8px;">
                <h5 class style="margin: 0;">Ofertas</h5>
              </div>
            </div>
          </div>
          <div v-if="catalog" class="row p-0 m-0" style="display: contents;">
            <div class="col-12 p-0 m-0" ref="productsWindow" style id="products">
              <div>
                <div class="vh-100" ref="desktopScroll">
                  <div class="mb-2" ref="content">
                    <div></div>
                    <div>
                      <!-- visao por familia -->
                      <div v-if="viewType == 'family'" style>
                        <div
                          style
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a
                                class="float-right pr-1"
                                href="javascript:void(0)"
                                @click="goToOffers()"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399;'"
                          >
                            <span
                              v-for="product in slicePerWidth(supplierOfferProducts)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length > slicePerWidth(supplierOfferProducts).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-for="(family, index) in catalog"
                          :key="'family-' + index"
                          style="background-color: #fbfdfe;"
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4 class style="margin: 0; padding-left: 5px;">{{ index }}</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <router-link
                                class="float-right pr-1"
                                v-if="index == 'Alimentos e bebidas'"
                                :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(index) } }"
                                style="color: inherit;"
                              >Ver tudo</router-link>
                              <router-link
                                class="float-right pr-1"
                                v-else
                                :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(index) } }"
                                style="color: inherit;"
                              >Ver tudo</router-link>
                            </div>
                          </div>
                          <div class="row pl-1" :style="'margin-top: 10px;'">
                            <span
                              v-for="product in slicePerWidth(productsFromFamily(index))"
                              :key="'product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="product.supplierProductExpeditions"
                                    :loadedTotals="totals"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="productsFromFamily(index).length > slicePerWidth(productsFromFamily(index)).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <router-link
                                      :to="{ name: 'public-store-family', params: { supplierSlug: slug, familyName: formatString(index) } }"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </router-link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao da familia alim e bebidas -->
                      <div v-if="viewType == 'family-collections'" ref="familyScroll" style>
                        <div
                          style
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a
                                class="float-right pr-1"
                                href="javascript:void(0)"
                                @click="goToOffers()"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399;'"
                          >
                            <span
                              v-for="product in slicePerWidth(supplierOfferProducts)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length > slicePerWidth(supplierOfferProducts).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-for="collection in collectionProducts"
                          :key="'collection-' + collection.collection"
                          style="background-color: #fbfdfe;  "
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px;"
                              >{{ collection.collection }}</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <a
                                class="float-right pr-1"
                                href="javascript:void(0)"
                                @click="selectedCollectionOnModal({ family: selectedFamily, collection: collection.collection })"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div class="row pl-1" :style="'margin-top: 10px;'">
                            <span
                              v-for="product in slicePerWidth(collection.products)"
                              :key="'product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="product.supplierProductExpeditions"
                                    :loadedTotals="totals"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="collection.products.length > slicePerWidth(collection.products).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="selectedCollectionOnModal({ family: selectedFamily, collection: collection.collection })"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por colecao -->
                      <div
                        v-if="viewType == 'collection'"
                        ref="collectionScroll"
                        style="padding-bottom: 5em;"
                      >
                        <div
                          style
                          ref="collectionOffers"
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a
                                class="float-right pr-1"
                                href="javascript:void(0)"
                                @click="goToOffers()"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399;'"
                          >
                            <span
                              v-for="product in slicePerWidth(supplierOfferProducts)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length > slicePerWidth(supplierOfferProducts).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div ref="collectionCategories">
                          <div
                            v-for="category in categoryProducts"
                            :key="'category-' + category.category"
                            style="background-color: #fbfdfe;"
                          >
                            <div
                              class="row mt-1 mb-1 m-0"
                              style="background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                            >
                              <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                                <h4
                                  class
                                  style="margin: 0; padding-left: 5px;"
                                >{{ category.category }}</h4>
                              </div>
                              <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                                <!-- <a
                                  class="float-right pr-1"
                                  v-if="selectedFamily == 'Alimentos e bebidas'"
                                  href="javascript:void(0)"
                                  @click="selectedCategoryAllProducts({ family: selectedFamily, category: category.category, collection: selectedCollection })"
                                >Ver tudo</a> -->
                                <router-link
                                  class="float-right pr-1"
                                  :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                  style="color: inherit;"
                                >Ver tudo</router-link>
                              </div>
                            </div>
                            <div class="row pl-3" style="overflow-x: hidden; margin-top: 10px;">
                              <div class="col-12 p-0 m-0">
                                <div class="row" style="margin-top: 10px; overflow-x: hidden;">
                                  <span
                                    v-for="product in slicePerWidthWithLines(category.products)"
                                    :key="'product' + product.id"
                                    style="width: 170px;"
                                    :id="'scrollTo' + product.productTypeId + '-' + product.id"
                                  >
                                    <div style="padding-left: 5px;">
                                      <h6 style="margin-bottom: 10px;">
                                        <a
                                          @click="clickedProductTitle(product)"
                                          style="text-decoration: underline;"
                                        >{{ product.productTypeName }}</a>
                                      </h6>
                                    </div>
                                    <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                      <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                        <PublicStoreProductCard
                                          :product="product"
                                          :expeditions="product.supplierProductExpeditions"
                                          :loadedTotals="totals"
                                          @quantity-input="checkTotals"
                                          @remove-item="removeFromCart"
                                          @fill-location="openLocationPopup"
                                        />
                                      </div>
                                    </div>
                                  </span>
                                  <div
                                    class="card font-small-3"
                                    v-if="category.products.length >= 12"
                                    style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                                  >
                                    <div class="card-body p-1">
                                      <div class="row">
                                        <div
                                          class="col-12 text-center"
                                        >Veja mais produtos deste tipo.</div>
                                        <div class="col-12 mt-1">
                                          <!-- <button
                                            v-if="selectedFamily == 'Alimentos e bebidas'"
                                            href="javascript:void(0)"
                                            @click="selectedCategoryAllProducts({ family: selectedFamily, category: category.category, collection: selectedCollection })"
                                            type="button"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span class="font-medium-1 align-middle">Ver tudo</span>
                                          </button> -->
                                          <router-link
                                            :to="{ name: 'public-store-category', params: { supplierSlug: slug, familyName: formatString(selectedFamily), categoryName: formatString(category.category) } }"
                                            class="btn btn-primary w-100"
                                            style="padding-left: 3px; padding-right: 3px;"
                                          >
                                            <span class="font-medium-1 align-middle">Ver tudo</span>
                                          </router-link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <!-- visao por categoria -->
                      <div v-if="viewType == 'category'" ref="categoryScroll" style>
                        <div
                          style
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a
                                class="float-right pr-1"
                                href="javascript:void(0)"
                                @click="goToOffers()"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399;'"
                          >
                            <span
                              v-for="product in slicePerWidth(supplierOfferProducts)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length > slicePerWidth(supplierOfferProducts).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-for="type in typeProducts"
                          :key="'type-' + type.type.productTypeId"
                          style="background-color: #fbfdfe;  "
                        >
                          <div
                            class="row mt-1 mb-1 m-0"
                            style="position: sticky; left: 0; background-color: white; border-top: 1px solid LightGray; border-bottom: 1px solid LightGray;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1 pb-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px;"
                              >{{ type.type.productType }}</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1 pb-1">
                              <router-link
                                class="float-right pr-1"
                                :to="{ name: 'public-store-product',
                                       params: { supplierSlug: slug,
                                                 familyName: formatString(selectedFamily),
                                                 categoryName: formatString(selectedCategory),
                                                 productTypeName: formatString(type.type.productType) } }"
                                style="color: inherit;"
                              >Ver tudo</router-link>
                            </div>
                          </div>
                          <div class="row pl-1" :style="'margin-top: 10px; '">
                            <span
                              v-for="product in slicePerWidth(type.products)"
                              :key="'product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="product.supplierProductExpeditions"
                                    :loadedTotals="totals"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="type.products.length > slicePerWidth(type.products).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <router-link
                                      :to="{ name: 'public-store-product',
                                             params: { supplierSlug: slug,
                                                       familyName: formatString(selectedFamily),
                                                       categoryName: formatString(selectedCategory),
                                                       productTypeName: formatString(type.type.productType) } }"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </router-link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-4 mb-4"></div>
                      </div>
                      <!-- visao por categoria com todos os produtos -->
                      <div v-if="viewType == 'category-all-products'" ref="categoryAllScroll" style>
                        <div
                          style
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a
                                class="float-right pr-1"
                                href="javascript:void(0)"
                                @click="goToOffers()"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399;'"
                          >
                            <span
                              v-for="product in slicePerWidth(supplierOfferProducts)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length > slicePerWidth(supplierOfferProducts).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="row pl-3"
                          style="background-color: #fbfdfe; overflow-x: hidden;"
                        >
                          <div class="col-12 p-0 m-0">
                            <div
                              class="row"
                              style="margin-top: 10px; padding-bottom: 10rem; overflow-x: hidden;"
                            >
                              <span
                                v-for="product in supplierProducts"
                                :key="'product' + product.id"
                                style="width: 170px;"
                                :id="'scrollTo' + product.productTypeId + '-' + product.id"
                              >
                                <div style="padding-left: 5px;">
                                  <h6 style="margin-bottom: 10px;">
                                    <a
                                      @click="clickedProductTitle(product)"
                                      style="text-decoration: underline;"
                                    >{{ product.productTypeName }}</a>
                                  </h6>
                                </div>
                                <div class="card font-small-3 mb-1" style="margin-right: 10px;">
                                  <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                    <PublicStoreProductCard
                                      :product="product"
                                      :expeditions="product.supplierProductExpeditions"
                                      :loadedTotals="totals"
                                      @quantity-input="checkTotals"
                                      @remove-item="removeFromCart"
                                      @fill-location="openLocationPopup"
                                    />
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <div
                        v-if="viewType == 'product-type'"
                        ref="typeScroll"
                        style="background-color: #fbfdfe; padding-bottom: 5em;"
                      >
                        <div
                          style
                          v-if="supplierOfferProducts && supplierOfferProducts.length && viewType == home"
                        >
                          <div
                            class="row mt-1 m-0"
                            style="position: sticky; left: 0; background-color: #ffd399;"
                          >
                            <div class="col-9 col-md-9 m-0 p-0 pt-1">
                              <h4
                                class
                                style="margin: 0; padding-left: 5px; color: #EA5455; font-weight: bold;"
                              >Ofertas!</h4>
                            </div>
                            <div class="col-3 col-md-3 m-0 p-0 pt-1">
                              <a
                                class="float-right pr-1"
                                href="javascript:void(0)"
                                @click="goToOffers()"
                              >Ver tudo</a>
                            </div>
                          </div>
                          <div
                            class="row pl-1"
                            :style="'padding-top: 10px; background-color: #ffd399;'"
                          >
                            <span
                              v-for="product in slicePerWidth(supplierOfferProducts)"
                              :key="'offer-product' + product.id"
                              style="width: 170px;"
                              :id="'scrollTo' + product.productTypeId + '-' + product.id + 'offer'"
                            >
                              <div style="padding-left: 5px;">
                                <h6 style="margin-bottom: 10px;">
                                  <a
                                    @click="clickedProductTitle(product)"
                                    style="text-decoration: underline;"
                                  >{{ product.productTypeName }}</a>
                                </h6>
                              </div>
                              <div
                                class="card font-small-3"
                                style="margin-right: 7px; margin-left: 3px;"
                                v-if="offerExpeditionsByProduct(product).length"
                              >
                                <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                  <PublicStoreProductCard
                                    :product="product"
                                    :expeditions="offerExpeditionsByProduct(product)"
                                    :loadedTotals="totals"
                                    :blockSaleBadge="true"
                                    @quantity-input="checkTotals"
                                    @remove-item="removeFromCart"
                                    @fill-location="openLocationPopup"
                                  />
                                </div>
                              </div>
                            </span>
                            <div
                              class="card font-small-3"
                              v-if="supplierOfferProducts.length > slicePerWidth(supplierOfferProducts).length"
                              style="width: 160px; height: 120px; margin-top: 25px; margin-right: 7px; margin-left: 3px;"
                            >
                              <div class="card-body p-1">
                                <div class="row">
                                  <div class="col-12 text-center">Veja mais produtos deste tipo.</div>
                                  <div class="col-12 mt-1">
                                    <button
                                      @click="goToOffers()"
                                      type="button"
                                      class="btn btn-primary w-100"
                                      style="padding-left: 3px; padding-right: 3px;"
                                    >
                                      <span class="font-medium-1 align-middle">Ver tudo</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          class="row pl-1"
                          style="margin-top: 10px; padding-bottom: 10rem; overflow-x: hidden;"
                        >
                          <span
                            v-for="product in productsFromType(selectedProductType)"
                            :key="'product' + product.id"
                            style="width: 170px;"
                            :id="'scrollTo' + product.productTypeId + '-' + product.id"
                          >
                            <div style="padding-left: 5px;">
                              <h6 style="margin-bottom: 10px;">
                                <span>{{ product.productTypeName }}</span>
                              </h6>
                            </div>
                            <div
                              class="card font-small-3 mb-1"
                              style="margin-right: 10px;"
                              v-if="expeditionsByProduct(product).length"
                            >
                              <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                <PublicStoreProductCard
                                  :product="product"
                                  :expeditions="expeditionsByProduct(product)"
                                  :loadedTotals="totals"
                                  @quantity-input="checkTotals"
                                  @remove-item="removeFromCart"
                                  @fill-location="openLocationPopup"
                                />
                              </div>
                            </div>
                          </span>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                      <div
                        v-if="viewType == 'sale'"
                        ref="saleScroll"
                        style="background-color: #fbfdfe; padding-bottom: 5em;"
                      >
                        <div class="row pl-1" style="margin-top: 10px;">
                          <span
                            v-for="product in supplierOfferProducts"
                            :key="'product' + product.id"
                            :style="widthRatio ? 'width: ' + widthRatio + '%;' : ''"
                            :id="'scrollTo' + product.productTypeId + '-' + product.id"
                          >
                            <div style="padding-left: 5px;">
                              <h6 style="margin-bottom: 10px;">
                                <a
                                  @click="clickedProductTitle(product)"
                                  style="text-decoration: underline;"
                                >{{ product.productTypeName }}</a>
                              </h6>
                            </div>
                            <div
                              class="card font-small-3 mb-1"
                              style="margin-right: 10px;"
                              v-if="offerExpeditionsByProduct(product).length"
                            >
                              <div class="card-body pl-1 pr-1 pt-0 pb-0">
                                <PublicStoreProductCard
                                  :product="product"
                                  :expeditions="offerExpeditionsByProduct(product)"
                                  :loadedTotals="totals"
                                  @quantity-input="checkTotals"
                                  @remove-item="removeFromCart"
                                  @fill-location="openLocationPopup"
                                />
                              </div>
                            </div>
                          </span>
                        </div>
                        <div
                          v-if="isLoading"
                          class="d-flex justify-content-center"
                          style="margin-top: 50px;"
                        >
                          <div
                            class="spinner-border text-primary"
                            style="width: 3rem; height: 3rem;"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="mt-1 mb-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <filters-sidebar-store
              ref="filtersVertical"
              :openSidebar="openSidebar"
              :products="filtersProducts"
              @update-sidebar="updateSidebar"
              @update-products="updateProductsByFilters"
              @apply-filters="applyFilters"
              @clear-filters="clearFilters"
            />
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.module-border-wrap {
  position: relative;
  background: linear-gradient(to right, #ffff00, #fe0000);
  border-radius: 0.5rem;
  padding: 3px;
}
.dot {
  height: 10px;
  width: 10px;
  background-color: PaleGreen;
  border-radius: 50%;
  display: inline-block;
}
.no-wrap {
  flex-wrap: nowrap;
}
.no-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}
.no-scrollbar::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import StoreFamiliesModal from "~/components/users/components/StoreFamiliesModal";
import OutOfRegionModal from "~/components/users/components/OutOfRegionModal";
import SupplierInfoModal from "~/components/suppliers/components/SupplierInfoModal";
import PublicStoreProductCard from "~/components/products/components/PublicStoreProductCard";
import StoreLocationModal from "~/components/users/components/StoreLocationModal";
import priceFormatter from "@/mixins/priceFormatter";
import FiltersSidebarStore from "~/components/productTypes/components/FiltersSidebarStore";
import "vue-context/dist/css/vue-context.css";

export default {
  metaInfo() {
    return {
      title: this.titleContent,
      titleTemplate: null,

       meta: [
         {
          vmid: "description",
          name: "description",
          content: this.descriptionContent,
        },
        {
          property: "og:title",
          content: this.titleContent,
        },
        {
          property: "og:description",
          content: this.descriptionContent,
        },
        {
          property: "og:image",
          itemprop: "image",
          content:  "https://meufornecedor.com.br/logo.png",
        },

        {
          property: "og:image:secure_url",
          itemprop: "image",
          content:  "https://meufornecedor.com.br/logo.png",
        },
       ]
    }
  },
  data() {
    return {
      color: "#0cb695",
      loader: "spinner",
      width: 110,
      height: 110,
      backgroundColor: "#0cb695",
      opacity: 0.3,
      fullPage: true,
      isLoading: false,
      loading: false,
      selectedProductType: undefined,
      slug: null,
      mobileBrowser: false,
      totals: [],
      total: 0,
      hasBelowMin: false,
      openLocation: false,
      allowAccess: false,
      openSidebar: false,
      filtersProducts: [],
      filteringTypeId: null,
      showFiltered: false,
      navigateToProduct: null,
      openSupplierInfo: false,
      targetClick: null,
      familiesModal: false,
      selectedCollection: null,
      selectedFamily: null,
      selectedCategory: null,
      viewType: "family",
      familyProducts: [],
      categoryProducts: [],
      typeProducts: [],
      collectionProducts: [],
      show: false,
      keyword: null,
      home: null,
      validFilter: false,
      renderCategories: [],
      lastLoadedCategory: 0,
      regionCanAccess: false,
      outOfRegionModal: false,
      catalogFamilies: '',
      titleContent: '',
      descriptionContent: '',
    };
  },

  created() {
    this.isMobile();
    this.isLoading = true;
    this.slug = this.$route.params.supplierSlug;
    this.clearExpeditionsBySupplier();
    this.clearSupplierProducts();
    this.loadStoreTotal();
    this.totals = JSON.parse(JSON.stringify(this.storeProducts));

    this.getSupplierBySlug(this.slug).then(() => {
      this.checkRegionAccess()
      this.getOfferProductsBySupplier({ supplierId: this.supplier.id });
      this.getOfferExpeditionsBySupplier({ supplierId: this.supplier.id });
      this.getCatalogById(this.supplier.id).then(() => {
      this.uniqueUsedFamilies()
      this.isLoading = false;
      this.openLocation = false;
      this.allowAccess = true;
      this.startStore();
      });
    });
  },

  mounted() {
    setTimeout(() => {
      if (this.supplier.user.supplierStatus != "Liberado") {
        this.$router.push({ name: "home" });
      }
    }, 2000);
  },

  computed: {
    ...mapState("suppliers", [
      "supplier",
      "catalog",
      "supplierProducts",
      "supplierOfferProducts",
      "supplierExpeditions",
      "supplierOfferExpeditions",
    ]),
    ...mapState("users/products", ["storeTotal", "storeProducts"]),
    maxPerScreen() {
      if (window.innerWidth >= 1910) {
        return 8;
      } else if (window.innerWidth >= 1680 && window.innerWidth < 1910) {
        return 7;
      } else if (window.innerWidth >= 1450 && window.innerWidth < 1680) {
        return 6;
      } else if (window.innerWidth >= 1220 && window.innerWidth < 1450) {
        return 6;
      } else if (window.innerWidth >= 1000 && window.innerWidth < 1220) {
        return 4;
      } else if (window.innerWidth >= 800 && window.innerWidth < 1000) {
        return 3;
      } else {
        return 2;
      }
    },

    widthRatio() {
      return (window.innerWidth / this.maxPerScreen / window.innerWidth) * 100;
    },

    searchBarStyle() {
      if (this.show) {
        return "width: 100%";
      } else return "display: none";
    },
  },

  methods: {
    ...mapActions("suppliers", [
      "getCatalogById",
      "getSupplierBySlug",
      "getCatalogByProductTypeAndSupplier",
      "getOfferProductsBySupplier",
      "getOfferExpeditionsBySupplier",
      "getExpeditionsByProductTypeAndSupplier",
      "clearExpeditionsBySupplier",
      "clearSupplierProducts",
      "getCatalogByFamilyAndSupplier",
      "getCatalogByCategoryAndSupplier",
      "getSampleCatalogByProductTypeAndSupplier",
      "getAllProductsByCategoryAndSupplier",
      "getCatalogByCollectionAndSupplier",
      "canUserAccessStore",
    ]),
    ...mapActions("users/products", [
      "setStoreTotal",
      "setStoreCanBuy",
      "updateStoreProducts",
      "removeFromStoreProducts",
      "loadStoreTotal",
    ]),
     uniqueUsedFamilies() {
      let aux = [];
      for(var family in this.catalog){
        aux.push(family)
      }
      this.catalogFamilies = aux.toString()
    },
    checkRegionAccess() {
      if(this.$auth.check()) {
        this.canUserAccessStore(this.supplier.id).then((response) => {
          if(response['allow'] && response['allow'] == 'yes')
            this.regionCanAccess = true
          else
            this.outOfRegionModal = true
        })
      } else {
        this.regionCanAccess = true
      }
    },
    storeHome() {
      // this.viewType = "family";
      // this.selectedCategory = null;
      // this.selectedCollection = null;
      // this.selectedFamily = null;
      // this.startStore();
      this.$router.push({ name: 'public-store' })
    },
    productsFromFamily(family) {
      var aux = this.familyProducts.find((obj) => obj.family == family);
      if (aux && aux.products) return aux.products;
      else return [];
    },
    openFamiliesModal() {
      this.familiesModal = true;
    },
    async selectProductType(productType) {
      this.isLoading = true;
      var ended = null;
      this.selectedProductType = this.findProductType(productType);
      this.resetScrolls(this.viewType, "product-type");
      this.viewType = "product-type";
      ended = await this.getCatalogByProductTypeAndSupplier({
        productTypeId: productType,
        supplierId: this.supplier.id,
      }).then(() => {
        var first = this.productsFromType(this.selectedProductType)[0];
        this.selectedCategory = first.categoryName;
        if (first.categoryCollection)
          this.selectedCollection = first.categoryCollection;
        else this.selectedCollection = "";
        this.selectedFamily = first.familyName;
        this.getExpeditionsByProductTypeAndSupplier({
          productTypeId: productType,
          supplierId: this.supplier.id,
        }).then(() => {
          this.isLoading = false;
          this.loading = false;
        });
      });
      return ended;
    },
    findProductType(productType) {
      var data = this.catalog;
      for (let family in data) {
        for (let collection in data[family]) {
          for (let category in data[family][collection]) {
            for (
              var i = 0;
              i < data[family][collection][category].length;
              i++
            ) {
              if (
                data[family][collection][category][i].productTypeId ==
                productType
              )
                return data[family][collection][category][i];
            }
          }
        }
      }
      return null;
    },
    loadFamilyProducts(family) {
      this.isLoading = true;
      this.getCatalogByFamilyAndSupplier({
        family: family,
        supplierId: this.supplier.id,
      }).then((response) => {
        this.isLoading = false;
        this.loading = false;
        this.familyProducts.push({ family: family, products: response });
      });
    },
    async loadCollectionProducts(family, collection) {
      var wait = await this.getCatalogByCollectionAndSupplier({
        family: family.replace(".", "_"),
        collection: collection.replace(".", "_").replace("/", "@"),
        supplierId: this.supplier.id,
      }).then((response) => {
        this.collectionProducts.push({
          family: family,
          collection: collection,
          products: response,
        });
        if (this.collectionProducts.length > 1)
          this.collectionProducts.sort((a, b) =>
            a.collection.localeCompare(b.collection)
          );
      });
      return wait;
    },
    async loadCategoryProducts(family, category) {
      var wait = await this.getCatalogByCategoryAndSupplier({
        family: family.replace(".", "_"),
        category: category.replace(".", "_").replace("/", "@"),
        supplierId: this.supplier.id,
      }).then((response) => {
        this.categoryProducts.push({
          family: family,
          category: category,
          products: response,
        });
        if (this.categoryProducts.length > 1)
          this.categoryProducts.sort((a, b) =>
            a.category.localeCompare(b.category)
          );
      });
      return wait;
    },
    async loadProductTypesProducts(family, category, type) {
      var wait = await this.getSampleCatalogByProductTypeAndSupplier({
        productTypeId: type.productTypeId,
        supplierId: this.supplier.id,
      }).then((response) => {
        this.typeProducts.push({
          family: family,
          category: category,
          type: type,
          products: response,
        });
        if (this.typeProducts.length > 1)
          this.typeProducts.sort((a, b) =>
            a.type.productType.localeCompare(b.type.productType)
          );
      });
      return wait;
    },
    async initialLoad() {
      if (Object.keys(this.catalog).length > 1) {
        this.home = "family";
        for (let family in this.catalog) {
          this.loadFamilyProducts(family);
        }
      } else {
        for (let family in this.catalog) {
          if (Object.keys(this.catalog[family]).length > 1) {
            this.home = "family-collections";
            this.$router.push({ name: 'public-store-family', params: { supplierSlug: this.slug, familyName: this.formatString(family) } })
            //this.selectedFamilyAllCollections(family);
          } else {
            for (let collection in this.catalog[family]) {
              if (Object.keys(this.catalog[family][collection]).length > 1) {
                this.home = "collection";
                this.selectedCollectionOnModal({
                  family: family,
                  collection: collection,
                });
              } else {
                for (let category in this.catalog[family][collection]) {
                  if (this.catalog[family][collection][category].length > 1) {
                    this.home = "category-all-products";
                    this.$router.push({ name: 'public-store-category', params: { supplierSlug: this.slug, familyName: this.formatString(family), categoryName: this.formatString(category) } })
                    // this.selectedCategoryAllProducts({
                    //   family: family,
                    //   collection: collection,
                    //   category: category,
                    // });
                  } else {
                    this.home = "product-type";
                    this.$router.push({ name: 'public-store-product',
                                        params: {
                                          supplierSlug: this.slug,
                                          familyName: this.formatString(family),
                                          categoryName: this.formatString(category),
                                          productTypeName: this.formatString(this.catalog[family][collection][category][0].productType)
                                        } })
                    // this.selectProductType(
                    //   this.catalog[family][collection][category][0]
                    //     .productTypeId
                    // );
                  }
                }
              }
            }
          }
        }
      }
      this.viewType = this.home;
    },
    async checkHome() {
      if (Object.keys(this.catalog).length > 1) {
        this.home = "family";
      } else {
        for (let family in this.catalog) {
          if (Object.keys(this.catalog[family]).length > 1) {
            this.home = "family-collections";
          } else {
            for (let collection in this.catalog[family]) {
              if (Object.keys(this.catalog[family][collection]).length > 1) {
                this.home = "collection";
              } else {
                for (let category in this.catalog[family][collection]) {
                  if (this.catalog[family][collection][category].length > 1) {
                    this.home = "category-all-products";
                  } else {
                    this.home = "product-type";
                  }
                }
              }
            }
          }
        }
      }
    },
    expeditionsByProduct(product) {
      return this.supplierExpeditions.filter(
        (obj) => obj.productExpedition.productId == product.id
      );
    },
    offerExpeditionsByProduct(product) {
      return this.supplierOfferExpeditions.filter(
        (obj) => obj.productExpedition.productId == product.id
      );
    },
    productChunks(products) {
      var result = [];
      var data = products;
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (i % this.maxPerScreen == 0) result.push([]);
          result[Math.floor(i / this.maxPerScreen)].push(data[i]);
        }
      }
      return result;
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
    checkTotals(totals) {
      let found = this.totals.find((obj) => obj.id == totals.id);
      if (found) {
        found.quantity = totals.quantity;
        found.total = totals.total;
      } else {
        this.totals.push(totals);
      }
      this.updateStoreProducts(totals);
      this.updateTotal();
    },
    removeFromCart(exp) {
      this.totals = this.totals.filter((obj) => obj.id != exp.id);
      this.removeFromStoreProducts(exp);
      this.loadStoreTotal();
      this.updateTotal();
    },
    updateTotal() {
      let sum = 0;
      this.hasBelowMin = false;
      for (let i = 0; i < this.totals.length; i++) {
        sum += this.totals[i].total;
        var formattedQuantity = this.totals[i].quantity;
        if (
          this.totals[i].minimum &&
          this.totals[i].quantity != "" &&
          formattedQuantity < this.totals[i].minimum
        )
          this.hasBelowMin = true;
      }
      this.total = sum;
      this.setStoreTotal(sum);
      if (
        !this.hasBelowMin &&
        this.supplier.minimumOrderValue &&
        sum >=
          parseFloat(
            this.supplier.minimumOrderValue
              .replace("R$", "")
              .replace(".", "")
              .replace(",", ".")
          )
      )
        this.setStoreCanBuy(true);
      else if (!this.hasBelowMin && !this.supplier.minimumOrderValue)
        this.setStoreCanBuy(true);
      else this.setStoreCanBuy(false);
    },
    allowZipcode(value) {
      // this.allowAccess = value
      if (value == true) this.targetClick.click();
    },
    normalizeString(s) {
      var r = s.toLowerCase();
      r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
      r = r.replace(new RegExp("ç", 'g'),"c");
      r = r.replace(new RegExp("[èéêë]", 'g'),"e");
      r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
      r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
      r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
      return r;
    },
    formatString(string) {
      return this.normalizeString(string).replace(/\s+/g, '-')
    },
    findKeyEncoded(object, encoded) {
      var aux = Object.keys(object).map(key => ({ original: key, encoded: this.formatString(key) }))
      var found = aux.find(obj => obj.encoded == encoded)
      return found
    },
    startStore(clickedHome = false) {
      if(this.$route.meta.familyView) {
        this.checkHome()
        var found = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        if (found) {
          if (found.original == "Alimentos e bebidas") {
            this.selectedFamilyAllCollections("Alimentos e bebidas")
          } else {
            this.selectedFamilyAllCategories(found.original)
          }
        }
      this.titleContent = this.supplier.user.name + " - " + this.selectedFamily + " | Meu Fornecedor"
      this.descriptionContent = "Loja digital de " + this.supplier.user.name + ". Confira seu catálogo de " + this.selectedFamily + " e compre online para seu restaurante, minimercado."
      } 
      else if(this.$route.meta.categoryView) {
        this.checkHome()
        var foundFamily = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        for(var collection in this.catalog[foundFamily.original]) {
          for(var category in this.catalog[foundFamily.original][collection]) {
            if(this.formatString(category) == this.$route.params.categoryName) {
              this.selectedCategoryAllProducts({
                family: foundFamily.original,
                collection: collection,
                category: category,
              });
            }
          }
        }
      this.titleContent = this.supplier.user.name + " - " + this.selectedCategory + " | Meu Fornecedor"
      this.descriptionContent = "Acesse a loja de " + this.supplier.user.name + " na plataforma Meufornecedor.com.br. Compre online " + this.selectedCategory + " para seu restaurante, minimercado."
      } 
      else if(this.$route.meta.productTypeView) {
        this.checkHome()
        var foundFamily2 = this.findKeyEncoded(this.catalog, this.$route.params.familyName)
        for(var collection2 in this.catalog[foundFamily2.original]) {
          for(var category2 in this.catalog[foundFamily2.original][collection2]) {
            for(var i = 0; i < this.catalog[foundFamily2.original][collection2][category2].length; i++) {
              if (this.formatString(this.catalog[foundFamily2.original][collection2][category2][i].productType) == this.$route.params.productTypeName &&
                  this.formatString(category2) == this.$route.params.categoryName) {
                this.selectProductType(this.catalog[foundFamily2.original][collection2][category2][i].productTypeId)
              }
            }
          }
        }
      this.titleContent = this.supplier.user.name + " - " + this.selectedProductType.productType + " | Meu Fornecedor"
      this.descriptionContent = "Compre online " + this.selectedProductType.productType + " de " + this.supplier.user.name + " na plataforma Meufornecedor.com.br. Simplifique as compras do seu restaurante, minimercado."
      }
      else {
        if (!clickedHome && this.$route.query.selected == "family") {
          if (this.$route.query.family == "Alimentos e bebidas")
            this.selectedFamilyAllCollections("Alimentos e bebidas");
          else
            this.selectedFamilyAllCategories(this.$route.query.family);
        } else if (!clickedHome && this.$route.query.selected == "category") {
          this.selectedCategoryOnModal({
            family: this.$route.query.family,
            collection: this.$route.query.collection,
            category: this.$route.query.category,
          });
        } else if (!clickedHome && this.$route.query.selected == "collection") {
          this.selectedCollectionOnModal({
            family: this.$route.query.family,
            collection: this.$route.query.collection,
          });
        } else if (!clickedHome && this.$route.query.selected == "type") {
          this.selectProductType(this.$route.query.productTypeId);
        } else
          this.initialLoad();
          this.titleContent = this.supplier.user.name + " | Meu Fornecedor"
          this.descriptionContent = "Compre online de " + this.supplier.user.name + ". Confira as ofertas em " + this.catalogFamilies + " e abasteça o estoque do seu restaurante, minimercado."
      }
    },
    scroll() {
      this.$refs["generalScroll"].onscroll = () => {
        if (this.viewType == "collection") {
          var offersHeight = 0;
          if (
            this.$refs["collectionOffers"] &&
            this.$refs["collectionOffers"].offsetHeight
          )
            offersHeight = this.$refs["collectionOffers"].offsetHeight;
          let bottomOfWindow =
            this.$refs["generalScroll"].scrollTop +
              this.$refs["generalScroll"].offsetHeight >
            offersHeight +
              this.$refs["collectionCategories"].offsetHeight -
              300;
          if (bottomOfWindow && !this.loading) {
            if (this.lastLoadedCategory + 1 < this.renderCategories.length) {
              this.loading = true;
              this.isLoading = true;
              this.lastLoadedCategory++;
              this.loadCategoryProducts(
                this.renderCategories[this.lastLoadedCategory].family,
                this.renderCategories[this.lastLoadedCategory].category
              ).then(() => {
                this.loading = false;
                this.isLoading = false;
              });
            }
          }
        }
      };
    },
    productsFromType(type, filtering = false) {
      if (
        !filtering &&
        this.showFiltered &&
        this.filteringTypeId == type.productTypeId
      )
        return this.filtersProducts;
      else
        return this.supplierProducts.filter(
          (prod) => prod.productTypeId == type.productTypeId
        );
    },
    updateSidebar(val) {
      this.openSidebar = val;
    },
    clickSidebar(type) {
      this.openSidebar = true;
      if (type.productTypeId != this.filteringTypeId) {
        this.showFiltered = false;
        this.filtersProducts = this.productsFromType(type, true);
      }
      this.filteringTypeId = type.productTypeId;
      setTimeout(() => {
        this.$refs.filtersVertical.loadNew();
      }, 300);
    },
    updateProductsByFilters(filters) {
      if (
        filters.brands.length ||
        filters.volumes.length ||
        filters.tags.length ||
        filters.properties.length
      ) {
        var productsTemp = this.productsFromType(
          { productTypeId: filters.productTypeId },
          true
        );
        if (filters.brands.length)
          productsTemp = productsTemp.filter((prod) =>
            filters.brands.includes(prod.brandId)
          );
        if (filters.volumes.length)
          productsTemp = productsTemp.filter(
            (prod) =>
              prod.packagingName == filters.volumes[0].packaging &&
              prod.unitsOfMeasurementName == filters.volumes[0].unit &&
              prod.quantity == filters.volumes[0].quantity
          );
        if (filters.tags.length)
          productsTemp = productsTemp.filter((prod) =>
            prod.secondaryCharacteristics.some((r) => filters.tags.includes(r))
          );
        if (filters.properties.length)
          productsTemp = productsTemp.filter((prod) =>
            filters.properties.includes(prod.propertyId)
          );
        this.filtersProducts = productsTemp;
        this.validFilter = true;
      } else {
        this.filtersProducts = this.productsFromType(
          { productTypeId: filters.productTypeId },
          true
        );
        this.validFilter = false;
        this.clearAllFilters();
      }

      setTimeout(() => {
        this.$refs.filtersVertical.loadNew();
      }, 300);
    },
    applyFilters() {
      this.showFiltered = true;
    },
    productsFromCategory(
      category,
      family,
      collection,
      hidePlaceholder = false
    ) {
      if (category) {
        var fromCategory = this.catalog[family][collection][
          category
        ].map((obj) => ({ value: obj.productTypeId, text: obj.productType }));
        //var fromCategory = this.loadProductTypes.filter(type => type.category == category).map(obj => ({ value: obj.productType.productTypeId, text: obj.productType.productType }))
        if (!hidePlaceholder)
          fromCategory.unshift({ value: null, text: "Prod." });
        return fromCategory;
      } else return [];
    },
    goToOffers() {
      this.selectedFamily = null;
      this.selectedCollection = null;
      this.selectedCategory = null;
      this.viewType = "sale";
    },
    updateSupplierPopup(val) {
      this.openSupplierInfo = val;
    },
    hasFilters(type) {
      if (this.mobileBrowser && this.showFiltered && this.validFilter)
        return true;
      else if (!this.mobileBrowser && this.showFiltered && this.validFilter)
        return true;
      else return false;
    },
    clearAllFilters() {
      this.showFiltered = false;
      //this.filteringTypeId = null
    },
    clearFilters() {
      this.showFiltered = false;
      this.filteringTypeId = null;
      this.filtersProducts = [];
    },
    updateLocationModal(val) {
      this.openLocation = val;
    },
    updateStoreFamiliesModal(val) {
      this.familiesModal = val;
    },
    openLocationPopup(target) {
      this.targetClick = target;
      this.openLocation = true;
      setTimeout(() => {
        document.getElementById("cepInput").focus();
      }, 500);
    },
    async selectedFamilyAllCollections(family) {
      this.selectedFamily = family;
      this.selectedCollection = null;
      this.selectedCategory = null;
      this.resetScrolls(this.viewType, "family-collections");
      this.viewType = "family-collections";

      this.collectionProducts = [];
      var wait = null;
      this.isLoading = true;

      for (let collection in this.catalog[family]) {
        wait = await this.loadCollectionProducts(family, collection);
      }
      if (!wait) this.isLoading = false;
    },
    async selectedCategoryOnModal(value) {
      this.selectedFamily = value.family;
      this.selectedCollection = value.collection;
      this.selectedCategory = value.category;
      this.resetScrolls(this.viewType, "category");
      this.viewType = "category";

      this.typeProducts = [];
      var wait = null;
      this.isLoading = true;

      for (
        var i = 0;
        i < this.catalog[value.family][value.collection][value.category].length;
        i++
      ) {
        wait = await this.loadProductTypesProducts(
          value.family,
          value.category,
          this.catalog[value.family][value.collection][value.category][i]
        );
      }
      if (!wait) this.isLoading = false;
    },
    selectedCategoryAllProducts(value) {
      this.selectedFamily = value.family;
      this.selectedCollection = value.collection;
      this.selectedCategory = value.category;
      this.selectedProductType = null;
      this.resetScrolls(this.viewType, "category-all-products");
      this.viewType = "category-all-products";

      this.isLoading = true;
      this.getAllProductsByCategoryAndSupplier({
        family: value.family.replace(".", "_").replace("/", "@"),
        category: value.category.replace(".", "_").replace("/", "@"),
        supplierId: this.supplier.id,
      }).then(() => {
        this.isLoading = false;
      });
    },
    async selectedCollectionOnModal(value) {
      this.selectedFamily = value.family;
      this.selectedCollection = value.collection;
      this.selectedCategory = null;
      this.resetScrolls(this.viewType, "collection");
      this.viewType = "collection";

      this.categoryProducts = [];
      var wait = null;
      this.isLoading = true;

      this.renderCategories = [];

      var initialLoad = 0;
      var initialLoadMax = 3;

      for (let category in this.catalog[value.family][value.collection]) {
        if (initialLoad < initialLoadMax) {
          wait = await this.loadCategoryProducts(value.family, category);
          this.lastLoadedCategory = initialLoad;
        }
        this.renderCategories.push({
          family: value.family,
          category: category,
        });
        initialLoad++;
      }
      if (!wait) {
        this.isLoading = false;
        this.scroll();
      }
    },
    async selectedFamilyAllCategories(family) {
      this.selectedFamily = family;
      this.selectedCollection = null;
      this.selectedCategory = null;
      this.resetScrolls(this.viewType, "collection");
      this.viewType = "collection";

      this.categoryProducts = [];
      var wait = null;
      this.isLoading = true;

      this.renderCategories = [];

      var initialLoad = 0;
      var initialLoadMax = 3;

      for (let category in this.catalog[family][""]) {
        if (initialLoad < initialLoadMax) {
          wait = await this.loadCategoryProducts(family, category);
          this.lastLoadedCategory = initialLoad;
        }
        this.renderCategories.push({ family: family, category: category });
        initialLoad++;
      }
      if (!wait) {
        this.isLoading = false;
        this.scroll();
      }
    },
    categoriesFromCollection(family, collection) {
      return this.catalog[family][collection];
    },
    collectionsFromFamily(family) {
      return this.catalog[family];
    },
    calcWidth(size) {
      var total = size * 178;
      if (size >= 6) total += 160;
      return total;
    },
    closing() {
      if (this.isMobile) {
        this.show = !this.show;
        if (this.show) {
          setTimeout(() => {
            this.$refs.searchBar.focus();
          }, 500);
        }
      }
    },
    runSupplierSearch() {
      this.$router.push({
        name: "public-store-search",
        params: { keyword: this.keyword },
      });
    },
    getFamilyIcon(family) {
      switch (family) {
        case "Alimentos e bebidas":
          return (
            '<img src="' +
            require(`~/assets/images/maca.svg`) +
            '" alt="*" width="16">'
          );
        case "Embalagens":
          return '<i class="feather icon-shopping-bag mr-25"></i>';
        case "Limpeza":
          return (
            '<img class="mr-25" src="' +
            require(`~/assets/images/window-cleaner.svg`) +
            '" alt="*" width="16">'
          );
        case "Utensílios":
          return '<i class="fa fa-cutlery mr-25"></i>';
      }
      return null;
    },
    clickedProductTitle(product) {
      // this.selectedFamily = product.familyName;
      // if (product.categoryCollection)
      //   this.selectedCollection = product.categoryCollection;
      // else this.selectedCollection = "";
      // this.selectedCategory = product.categoryName;
      // this.selectProductType(product.productTypeId);
      this.$router.push({ name: 'public-store-product',
                          params: {
                            supplierSlug: this.slug,
                            familyName: this.formatString(product.familyName),
                            categoryName: this.formatString(product.categoryName),
                            productTypeName: this.formatString(product.productTypeName)
                          } })
    },
    resetScrolls(oldView, newView) {
      /* if (oldView != newView) {
        if (this.$refs.mobileCategoryChips)
          this.$refs.mobileCategoryChips.scrollLeft = 0;
        if (this.$refs.mobileCollectionChips)
          this.$refs.mobileCollectionChips.scrollLeft = 0;
        if (this.$refs.mobileFamilyChips)
          this.$refs.mobileFamilyChips.scrollLeft = 0;
      } */

      if (this.$refs.familyScroll) this.$refs.familyScroll.scrollTop = 0;
      if (this.$refs.generalScroll) this.$refs.generalScroll.scrollTop = 0;
      if (this.$refs.collectionScroll)
        this.$refs.collectionScroll.scrollTop = 0;
      if (this.$refs.categoryScroll) this.$refs.categoryScroll.scrollTop = 0;
      if (this.$refs.categoryAllScroll)
        this.$refs.categoryAllScroll.scrollTop = 0;
      if (this.$refs.typeScroll) this.$refs.typeScroll.scrollTop = 0;
      if (this.$refs.saleScroll) this.$refs.saleScroll.scrollTop = 0;
    },
    slicePerWidth(products) {
      return products.slice(0, Math.floor(window.innerWidth / 172) - 1);
    },
    slicePerWidthWithLines(products) {
      var perLine = Math.floor(window.innerWidth / 172);
      var minProducts = Math.min(perLine * 2 - 1, 21);
      return products.slice(0, minProducts);
    },
    scrollXProducts(e) {
      this.$refs["scrollProducts"].scrollLeft += e.deltaY;
    },
    scrollXCategoriesAB(e) {
      this.$refs["scrollCategoriesAB"].scrollLeft += e.deltaY;
    },
    scrollXCategories(e) {
      this.$refs["scrollCategories"].scrollLeft += e.deltaY;
    },
    scrollXCollections(e) {
      this.$refs["scrollCollections"].scrollLeft += e.deltaY;
    },
    shareOnWhatsapp() {
      var url =
        "https://api.whatsapp.com/send?text=" +
        "Ol%C3%A1!%20Peguei%20seu%20contato%20pela%20plataforma%20Meu%20Fornecedor.%0AEst%C3%A1%20podendo%20falar%20agora%3F" +
        "&phone=55" +
        this.supplier.user.phone
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "");
      window.open(url, "_blank");
    },
    scrollToTop() {
      this.$refs.generalScroll.scrollTop = 0;
    },
    hasScroll(scroll) {
      if (scroll && scroll.scrollWidth > scroll.clientWidth) {
        return true;
      } else return false;
    },
    addScrollX(scroll, direction) {
      if (scroll) scroll.scrollLeft += 50 * direction;
    },
  },
  components: {
    PublicStoreProductCard,
    StoreLocationModal,
    FiltersSidebarStore,
    SupplierInfoModal,
    StoreFamiliesModal,
    OutOfRegionModal,
  },
  mixins: [priceFormatter],
};
</script>
