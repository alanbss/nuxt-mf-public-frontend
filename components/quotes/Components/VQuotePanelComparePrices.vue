<template>
  <!-- Modal - Comparar preços -->
  <div class="modal fade text-left" id="comparar-precos" tabindex="-1" role="dialog" aria-labelledby="myModalComparar" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h4 class="modal-title" id="myModalComparar">Comparar preços <span class="d-block font-weight-normal font-small-3">Escolha o produto</span></h4>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body bg-rgba-success p-0">
                  <div class="nav-vertical" style="background: linear-gradient(90deg, #DFF7EA 0%, #DFF7EA 33%, #fff 33%, #fff 100%);">
                      <ul class="nav nav-tabs nav-left flex-column pr-0 pl-50 pt-1 mr-50" style="width: 33%" role="tablist">
                          <li class="nav-item">
                              <a class="nav-link active" id="baseCompararPrecos-tab1" data-toggle="tab" aria-controls="tabCompararPrecos1" href="#tabCompararPrecos1" role="tab" aria-selected="true">
                                  Alimentos e Bebidas
                              </a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" id="baseCompararPrecos-tab2" data-toggle="tab" aria-controls="tabCompararPrecos2" href="#tabCompararPrecos2" role="tab" aria-selected="false">
                                  Embalagens
                              </a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" id="baseCompararPrecos-tab3" data-toggle="tab" aria-controls="tabCompararPrecos3" href="#tabCompararPrecos3" role="tab" aria-selected="false">
                                  Limpeza
                              </a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" id="baseCompararPrecos-tab4" data-toggle="tab" aria-controls="tabCompararPrecos4" href="#tabCompararPrecos4" role="tab" aria-selected="false">
                                  Utensílios
                              </a>
                          </li>
                      </ul>
                      <div class="tab-content">
                        <div class="tab-pane active pl-1" id="tabCompararPrecos1" role="tabpanel" aria-labelledby="baseCompararPrecos-tab1">
                          <div id="accordionCompararCat1" role="tablist" aria-multiselectable="true">
                            <div class="card shadow-none collapse-icon accordion-icon-rotate mb-1">
                              <div class="accordion-default collapse-bordered">
                                <div class="card collapse-header" style="border-color: #eee;">
                                  <div id="Cat1-heading1" class="card-header collapse-header" data-toggle="collapse" role="button" data-target="#Cat1-accordion1" aria-expanded="false" aria-controls="Cat1-accordion1">
                                    <span class="lead collapse-title">
                                      <strong class="font-small-3">Nome da categoria 1</strong>
                                      <span class="d-block font-small-2">999 produtos</span>
                                    </span>
                                  </div>
                                  <div id="Cat1-accordion1" role="tabpanel" data-parent="#accordionCompararCat1" aria-labelledby="Cat1-heading1" class="collapse">
                                    <div class="card-content">
                                      <div class="card-body pt-0">
                                        <span class="d-block my-50">
                                          <a href="#" class="btn btn-outline-primary py-50 px-2 waves-effect waves-light text-left font-small-3" style="border-radius: 30px;">Nome do produto pequeno<span class="d-block mt-25 text-body font-small-2">999 fornecedores</span></a>
                                        </span>
                                        <span class="d-block my-50">
                                          <a href="#" class="btn btn-outline-primary py-50 px-2 waves-effect waves-light text-left font-small-3" style="border-radius: 30px;">Nome do produto grande<span class="d-block mt-25 text-body font-small-2">999 fornecedores</span></a>
                                        </span>
                                        <span class="d-block my-50">
                                          <a href="#" class="btn btn-outline-primary py-50 px-2 waves-effect waves-light text-left font-small-3" style="border-radius: 30px;">Nome do produto bem comprido<span class="d-block mt-25 text-body font-small-2">999 fornecedores</span></a>
                                        </span>
                                        <span class="d-block my-50">
                                          <a href="#" class="btn btn-outline-primary py-50 px-2 waves-effect waves-light text-left font-small-3" style="border-radius: 30px;">Nome do produto mini<span class="d-block mt-25 text-body font-small-2">999 fornecedores</span></a>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
//import { mapActions, mapGetters } from "vuex";
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    //...mapGetters("users/products", ["productIsOnList", "productIsOnCart", "productCartIsEmpty"]),
    ...mapState("users/products", ["productQuoteCart"]),
  },
  methods: {
    ...mapActions("quotes", [
      "createQuote"
    ]),
  },
  props: {
    quote: {
      type: Object,
      required: true
    }
  },
};
</script>

<style scoped>
  .no-underline a:hover{
      text-decoration: none;
  }
</style>
