<template>
  <div class="container-fluid p-0" :style="'height: ' + maxHeight + 'px;'">


    <div class="row align-items-center h-100">
      <div class="col-md-6 h-100 d-flex align-content-center flex-wrap">
        <div class="w-75 m-auto py-2">
          <div class="row d-flex">
            <h3 class="font-weight-bold mt-1 mb-1 color-mf-verde">
              Sua conta está suspensa
            </h3>
          </div>
          <div class="row d-flex">
            <p class="mb-1">
              No momento, seu cadastro está suspenso<br>
              (ou cancelado).<br>
              <br>
              Se acredita ter acontecido algum erro, favor<br>
              entrar em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      maxHeight: null,
    };
  },

  mounted() {
    this.maxHeight = window.innerHeight - 450
  },

  computed: {

  },

  methods: {

  },
  components: {

  },

};
</script>


<style scoped>
.h-100 {
  height: 100% !important;
}
</style>
