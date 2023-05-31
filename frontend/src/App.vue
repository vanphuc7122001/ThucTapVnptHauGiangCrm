<script>
import Navbar from "./components/layout/navbar.vue";
import Footer from "./components/layout/footer.vue";
import Sidebar from "./components/layout/sidebar.vue";
import Login from "./login.vue";
import { reactive, defineComponent } from "vue";
export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Login,
  },
  setup() {
    const data = reactive({
      activeMenuResponsive: false,
    });
    const updateMenuResponsive = () => {
      console.log("Received event from child component:");
    };
    return {
      data,
      updateMenuResponsive,
    };
  },
};
</script>

<template>
  <!-- <Login /> -->
  <div class="container-fluid">
    <div class="row position-relative">
      <div
        class="z-index-3"
        :class="[
          data.activeMenuResponsive ? 'd-block' : 'col-xl-2 d-none d-xl-block',
        ]"
      >
        <Sidebar />
      </div>
      <div class="col-xl-10 col-sm-12 z-index-2">
        <Navbar @showMenu="data.activeMenuResponsive = true" />
        <RouterView></RouterView>
        <Footer />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
