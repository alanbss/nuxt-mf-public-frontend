<template>
  <section
    v-if="!$auth.check()"
    class="card mb-1 text-white"
    style="background: linear-gradient(118deg, #7367F0, rgba(115, 103, 240, 0.7)); padding: 0;"
  >
    <div class="card-content">
      <div class="card-body">
        <div class="row d-md-none">
          <div class="col-4 text-center">
            <img src="~/assets/images/mf-logo-white.png" class="img-fluid mt-2" alt />
          </div>
          <div class="col-8">
            <span
              class="font-small-3 font-weight-bold d-block pb-1"
            >Para restaurantes, hotéis, padarias, minimercados</span>
            <span
              class="font-small-3"
            >Cote com vários fornecedores numa só tacada, compare preços, emita pedidos de compra</span>
          </div>
        </div>
        <div class="d-md-block d-none pt-1 px-2">
          <div class="row">
            <div class="col-md-3">
              <div style="border-right: solid 1px rgba(255,255,255,0.2);">
                <p class="font-weight-bold" style="margin-bottom: 0.2rem;">
                  Simplifique as compras
                  <br />do seu restaurante
                </p>
                <p class="font-small-3">ou bar, padaria, minimercado, hotel...</p>
              </div>
            </div>
            <div class="col-md-3">
              <div class="media">
                <span class="mr-2 font-large-2 text-white-50">1</span>
                <div class="media-body">
                  <h5 class="text-white font-weight-bold font-medium-1">Escolha os produtos</h5>
                  <span
                    class="font-small-3"
                  >De alimentos à utensílios, de tudo para atender seu negócio</span>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="media">
                <span class="mr-2 font-large-2 text-white-50">2</span>
                <div class="media-body">
                  <h5 class="text-white font-weight-bold font-medium-1">Emita a cotação</h5>
                  <span class="font-small-3">Cotações para vários fornecedores numa só tacada</span>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="media">
                <span class="mr-2 font-large-2 text-white-50">3</span>
                <div class="media-body">
                  <h5 class="text-white font-weight-bold font-medium-1">Compare preços</h5>
                  <span class="font-small-3">Emita pedidos de compra separados por fornecedor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
