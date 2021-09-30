<template>
  <div
    style="position: fixed;
    bottom: 0; background: white; width:100%; display:flex; flex-direction: row; z-index: 999; justify-content: space-around;"
  >
    <a href="/" class="p-1" style="color: black;">
      <div style="display: flex; flex-direction: column; place-items: center;">
        <img
          :class="this.$route.name == 'home' ? 'd-inherit' : 'd-none'"
          src="~/assets/images/menu2.png"
          width="25px"
          alt="menu"
        />
        <img
          :class="this.$route.name == 'home' ? 'd-none' : 'd-inherit'"
          src="~/assets/images/menu1.png"
          width="25px"
          alt="menu"
        />
        <span>Início</span>
      </div>
    </a>

    <a style="color: black;" href="/cotar-em-massa" class="p-1">
      <div style="display: flex; flex-direction: column; place-items: center;">
        <img
          src="~/assets/images/cmassa2.png"
          :class="this.$route.name == 'cotar' ? 'd-inherit' : 'd-none'"
          width="25px"
          alt="menu"
        />
        <img
          src="~/assets/images/cmassa1.png"
          :class="this.$route.name == 'cotar' ? 'd-none' : 'd-inherit'"
          width="25px"
          alt="menu"
        />
        <span>Cotar</span>
      </div>
    </a>

    <a style="color: black;" href="/fornecedores" class="p-1">
      <div style="display: flex; flex-direction: column; place-items: center;">
        <img
          src="~/assets/images/loja2.png"
          :class="this.$route.name == 'suppliers' ? 'd-inherit' : 'd-none'"
          width="25px"
          alt="menu"
        />
        <img
          src="~/assets/images/loja1.png"
          :class="this.$route.name == 'suppliers' ? 'd-none' : 'd-inherit'"
          width="25px"
          alt="menu"
        />
        <span>Pedir direto</span>
      </div>
    </a>
  </div>
</template>
<script>
export default {
  name: "VNewBottomBar",
};
</script>