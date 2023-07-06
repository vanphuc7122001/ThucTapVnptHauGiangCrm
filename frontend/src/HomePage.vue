<script>
import Navbar from "./components/layout/navbar.vue";
import Footer from "./components/layout/footer.vue";
import Sidebar from "./components/layout/sidebar.vue";
import { reactive, ref, computed, watch, onMounted } from "vue";
import sidebarVue from "./components/layout/sidebar.vue";
export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const data = reactive({
      activeMenuResponsive: false,
      activeIndex: sessionStorage.getItem("activeMenu") || 1,
    });
    const updateMenuResponsive = () => {
      // console.log("Received event from child component:");
    };
    const isSideBar = ref(true);

    // Check if the device's maximum width is 992 pixels

    const showSidebar = () => {
      // console.log("Thay đổi sidebar:", isSideBar.value);
      isSideBar.value = !isSideBar.value;
    };
    const isIPadAndMaxWidth992 = () => {
      // const isIPad = /iPad/.test(navigator.userAgent) && !window.MSStream;
      const isMaxWidth992 = window.innerWidth <= 992;
      return isMaxWidth992;
    };
    const isIpad = ref(false);
    watch(isSideBar, (newValue, oldValue) => {
      isIpad.value = isIPadAndMaxWidth992();
    });
    onMounted(() => {
      isIpad.value = isIPadAndMaxWidth992();
    });
    return {
      data,
      updateMenuResponsive,
      isSideBar,
      showSidebar,
      isIPadAndMaxWidth992,
      isIpad,
    };
  },
};
</script>

<template>
  <div>
    <nav class="navbar">
      <!-- Navbar content goes here -->
      <Navbar @showMenu="showSidebar()" />
    </nav>
    <div class="sidebar" :class="{ showSidebar: isIpad && isSideBar }">
      <!-- Sidebar content goes here -->
      <Sidebar :activeIndex="data.activeIndex" />
    </div>
    <!-- <div class="sidebar" v-if="isIpad">
      <Sidebar
        :activeIndex="data.activeIndex"
        :style="{
          display: isSideBar ? 'block' : 'none',
          width: isSideBar ? '200px' : '0px',
          'z-index': isSideBar ? '' : '0',
          'background-color': isSideBar ? 'rgba(255, 255, 255, 1)' : 'white',
        }"
      />
    </div> -->

    <div class="content">
      <!-- Content goes here -->
      <router-view></router-view>
    </div>
    <div class="footer">
      <!-- Footer goes here -->
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.none {
  display: none;
  width: 0px;
}
.show-sidebar {
  display: block !important;
  width: 200px;
}
.showSidebar {
  display: block;
  width: 200px;
  z-index: 9999;
  background-color: var(--light);
  position: absolute;
}
</style>