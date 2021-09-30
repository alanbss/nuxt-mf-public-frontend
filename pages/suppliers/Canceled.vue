<template>
  <div class="content-wrapper">
    <div class="row d-flex justify-content-center">
      <div style="margin-top: 80px;">
        <div class="row d-flex">
          <h3 class="font-weight-bold mt-1 mb-1" style="color: #f57f17;">
            Sua conta está cancelada
          </h3>
        </div>
        <div class="row d-flex">
          <p class="mb-1">
            Algo não está certo?<br>
            Favor entrar em contato com a administração do Meu Fornecedor.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Canceled",
  mounted() {

  },
  computed: {
    userEmail() {
      return this.$auth.user().email
    }
  },
  methods: {

  },
  components: {

  },
};
</script>
