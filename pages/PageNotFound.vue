<template>
  <div>
    <div class="card mb-0 px-2 pb-2 pt-2">
      <div class="card-header pb-1">
        <div class="card-title">
          <div class="d-none mobile-only-block" style="text-align: center;">
            <router-link :to="{name: 'home'}">
              <img src="@/assets/images/mf-login.png" style="max-width: 250px; margin-bottom: 20px;" alt />
            </router-link>
          </div>
          <h4 class="mb-0">Página não encontrada</h4>
          <h5>O endereço que você acessou não existe</h5>
        </div>
      </div>

      <div class="card-content pb-1">
        <div class="card-body pt-3">
          <router-link
            :to="{name: 'home'}"
            class="btn btn-primary float-left btn-inline"
          >Ir para o início</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {

    };
  },
  computed: {

  },
  methods: {

  },
  components: {
  }
};
</script>
