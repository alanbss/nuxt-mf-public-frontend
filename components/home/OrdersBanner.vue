<template>
  <div class="card" :class="mobileBrowser ? 'main-card-mobile' : 'main-card-desktop' ">
    <div style="display: flex; flex-direction: column;">
      <div class="p-1"
        style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-between;     padding-bottom: 0 !important;"
      >
        <h5>Pedidos de compra</h5>
        <a
          v-if="this.allOrders.length"
          href="/pedidos-de-compra"
          style="    white-space: nowrap;"
        >Ver tudo</a>
      </div>
      <span style="    padding: 0px 10px 0px 10px;">
        <small>Compartilhe os pedidos de compra com o pessoal do recebimento</small>
      </span>
      <div
        v-if="this.allOrders.length"
        :class="mobileBrowser ? 'cards-overflow-mobile' : 'cards-overflow-desktop' "
        style="padding: 10px;"
      >
        <div v-for="purchaseRequest in allOrders.slice().reverse()" v-bind:key="purchaseRequest.id">
          <a href="/pedidos-de-compra" style="color: black !important;">
            <div
              class="card p-1"
              :class="mobileBrowser ? 'order-card-mobile' : 'order-card-desktop' "
            >
              <div style="display: flex; flex-direction:column;">
                <span>
                  <small>{{formatDate(purchaseRequest.updatedAt)}}</small>
                </span>
                <h4 class="price-text">Total: {{formatPrice(purchaseRequest.totalPrice)}}</h4>
                <span class="supplier-name">{{purchaseRequest.supplierName}}</span>
                <span
                  :class="statusClass(purchaseRequest.status)"
                >{{changeStatus(purchaseRequest.status)}}</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div v-else>
        <div class="p-1" style=" display: flex; flex-direction: column; flex-wrap: nowrap;">
          <span>Você ainda não emitiu pedidos a fornecedores.</span>
          <span>Você pode pedir direto ou através da cotação em massa.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.supplier-name {
  font-weight: 700;
  color: black;
}
.price-text {
  color: black;
}
.accepted-text {
  color: green;
  font-weight: 400;
}
.refused-text {
  color: red;
  font-weight: 400;
}
.waiting-text {
  color: gray;
  font-weight: 400;
}
.cards-overflow-mobile {
  display: flex;
  overflow: auto;
}
.cards-overflow-desktop {
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
}
.main-card-desktop {
  background: white;
  width: min-content;
  height: 85vh;
  overflow: hidden;
  margin-right: 25px;
}
.main-card-mobile {
  background: white;
  width: min-content;
}
.order-card-mobile {
  margin-right: 25px;
  width: 210px;
}
.order-card-desktop {
  display: block;
  display: block;
  margin-bottom: 15px;
}
</style>

<script>
import priceFormatter from "@/mixins/priceFormatter";
import { mapState, mapActions } from "vuex";
var sortBy = require('lodash.sortby');
export default {
  data() {
    return {
      allOrders: [],
      quoteLoading: false,
      mobileBrowser: false,
    };
  },
  created() {
    this.isMobile();
    this.getOrders({ supplier: null, date: null }).then(() => {
      this.getDirectOrders().then(() => {
        this.allOrders = this.orders.concat(this.directOrders);
        this.allOrders = sortBy(this.allOrders, 'updatedAt')
      });
    });
  },
  computed: {
    ...mapState("quotations", ["orders"]),
    ...mapState("orders", ["directOrders"]),
  },
  methods: {
    ...mapActions("quotations", ["getOrders", "getQuotationProducts"]),
    ...mapActions("orders", ["getDirectOrders", "getOrderTotal"]),

    toQuotePainel() {
      this.quoteLoading = true;
      setTimeout(() => {
        this.quoteLoading = false;
      }, 300);
      this.$router.push({ name: "users.orderPanel" });
    },
    formatDate(date) {
      var m = new Date(date);
      var dateString =
        m.getDate() +
        "/" +
        (m.getMonth() + 1) +
        "/" +
        m.getFullYear() +
        " - " +
        m.getHours() +
        ":" +
        String(m.getMinutes()).padStart(2, "0");
      return dateString;
    },
    changeStatus(label) {
      if (label == "Pedido de compra a confirmar") {
        return "Aguardando aprovação";
      } else if (label == "Pedido de compra confirmado") {
        return "Aprovado";
      } else {
        return "Recusado";
      }
    },
    statusClass(label) {
      if (label == "Pedido de compra a confirmar") {
        return "waiting-text";
      } else if (label == "Pedido de compra confirmado") {
        return "accepted-text";
      } else {
        return "refused-text";
      }
    },
    isMobile() {
      if (screen.width <= 760 || window.innerWidth <= 760) {
        this.mobileBrowser = true;
      } else {
        this.mobileBrowser = false;
      }
    },
  },
  mixins: [priceFormatter],
};
</script>