<script setup>
import { ref } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <!-- Menu điều hướng -->
        <nav class="nav flex-column">
          <a class="nav-link active" href="#">Trang chủ</a>
          <a class="nav-link" href="#">Danh sách khách hàng</a>
          <a class="nav-link" href="#">Danh sách sản phẩm</a>
          <a class="nav-link" href="#">Danh sách đơn hàng</a>
          <a class="nav-link" href="#">Báo cáo</a>
        </nav>
      </div>
      <div class="col-md-9">
        <!-- Nội dung trang chủ -->
        <h1 class="mt-4">Hệ thống quản lý thông tin</h1>
        <div class="mt-4">
          <h3>Xin chào! Chào mừng đến với hệ thống quản lý thông tin.</h3>
          <p>
            Đây là trang chủ của hệ thống, từ đây bạn có thể truy cập vào các
            chức năng khác của hệ thống.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <h1 class="mt-4">Hệ thống quản lý thông tin</h1>

    <!-- Menu điều hướng -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Trang chủ</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#">Danh sách khách hàng</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Danh sách sản phẩm</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Danh sách đơn hàng</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Báo cáo</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Nội dung trang chủ -->
    <div class="mt-4">
      <h3>Xin chào! Chào mừng đến với hệ thống quản lý thông tin.</h3>
      <p>
        Đây là trang chủ của hệ thống, từ đây bạn có thể truy cập vào các chức
        năng khác của hệ thống.
      </p>
    </div>
  </div>
  <div>
    <i class="bi bi-heart-fill"></i>
    <!-- Biểu tượng heart-fill -->
    <i class="bi bi-star"></i>
    <!-- Biểu tượng star -->
    <!-- Các biểu tượng khác -->
  </div>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
