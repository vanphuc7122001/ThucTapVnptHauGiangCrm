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
    const updateMenuResponsive = (value) => {
      console.log("Received event from child component:", value);
    }
    return {
      data,
      updateMenuResponsive
    };
  },
};
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl-2 d-none d-xl-block">
        <Sidebar @updateMenuResponsive="updateMenuResponsive" />
      </div>
      <div class="col-xl-10 col-sm-12">
        <Navbar />
        <RouterView></RouterView>
        <Footer />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

