<template>
  <section class="row flexbox-container">
    <div class="col-xl-8 col-11 d-flex justify-content-center" style="margin: 25px 0;">
      <div class="card bg-authentication rounded mb-0 border-top-green">
        <div class="row m-0">
          <div class="col-lg-6 d-lg-block d-none text-center align-self-center px-1 py-0">
            <router-link :to="{name: 'home'}">
              <img src="@/assets/images/mf-login.png" alt />
            </router-link>
            <p
              class="color-mf-verde font-weight-bold px-5 py-1"
            >Cote produtos para seu restaurante com vários fornecedores ao mesmo tempo.</p>
          </div>
          <div class="col-lg-6 col-12 p-0">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>