<template>
    <div class="container">
      <div class="row justify-content-center align-items-center vh-100">
        <div class="col-lg-4">
          <div class="card shadow">
            <div class="card-body p-5">
              <h5 class="card-title text-center mb-4">Đăng nhập</h5>
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input v-model="email" type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Mật khẩu</label>
                  <input v-model="password" type="password" class="form-control" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      login() {
        // Xử lý logic đăng nhập
        console.log('Đăng nhập thành công');
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    background-color: #f8f9fa;
  }
  
  .card {
    border: none;
    border-radius: 10px;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0069d9;
    border-color: #0069d9;
  }
  
  .vh-100 {
    height: 100vh;
  }
  </style>