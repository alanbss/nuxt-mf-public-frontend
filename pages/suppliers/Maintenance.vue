<template>
  <div class="content-wrapper">
    <div class="row d-flex justify-content-center">
      <div style="margin-top: 80px;">
        <div class="row d-flex">
          <h3 class="font-weight-bold mt-1 mb-1" style="color: #f57f17;">
            Sua conta está em manutenção
          </h3>
        </div>
        <div class="row d-flex">
          <p class="mb-1">
            No momento seu acesso está suspenso.<br>
            Enquanto estivermos atualizando os produtos do seu catálogo, os<br>
            clientes não podem emitir cotações a você, nem emitir pedidos.
          </p>
        </div>
        <div class="row d-flex">
          <p class="m-0">
            Vamos te avisar por email ({{ userEmail }}) assim que<br>
            acabarmos a atualização do seu catálogo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Maintenance",
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
