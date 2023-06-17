<script>
import Navbar from "./components/layout/navbar.vue";
import Footer from "./components/layout/footer.vue";
import Sidebar from "./components/layout/sidebar.vue";
import { reactive } from "vue";
export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
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
  <nav class="navbar">
    <!-- Navbar content goes here -->
    <Navbar />
  </nav>
  <div class="sidebar">
    <!-- Sidebar content goes here -->
    <Sidebar />
  </div>
  <div class="content">
    <!-- Content goes here -->
    <router-view></router-view>
  </div>
  <div class="footer">
    <!-- Footer goes here -->
    <Footer />
  </div>
  <!-- <div class="w-100">
    <div class="row">
      <div
        class=""
        :class="[data.activeMenuResponsive ? 'd-block' : 'col-lg-2 d-none d-xl-block']"
      >
        <Sidebar />
      </div>
      <div class="col-lg-10">
        <Navbar @showMenu="data.activeMenuResponsive = true" />
        <router-view></router-view>
        <Footer />
      </div>
    </div>
  </div> -->
</template>

<style scoped></style>
