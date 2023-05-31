<template>
  <!-- The Modal -->
  <div class="modal" id="model-addaccount">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm Tài Khoản</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="/action_page.php" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Họ Tên(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="fullname"
                name="fullname"
                v-model="item.fullname"
                required
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Tên Đăng Nhập(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="username"
                name="username"
                v-model="item.username"
                required
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Email(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="email"
                name="email"
                v-model="item.email"
                required
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Ngày Sinh(<span style="color: red">*</span>):</label
              >
              <input
                type="Date"
                class="form-control"
                id="birthday"
                name="birthday"
                v-model="item.birthday"
                required
              />
            </div>
            <div class="form-group">
              <label for="name"
                >Ngày Đăng Ký(<span style="color: red">*</span>):</label
              >
              <input
                type="Date"
                class="form-control"
                id="registrationdate"
                name="registrationdate"
                v-model="item.registrationdate"
                required
              />
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px;float: right"
              @click="create"
              id="addaccount"
            >
              <span>Thêm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const create = () => {
      if (
        props.item.fullname.length > 0 &&
        props.item.username.length > 0 &&
        props.item.email.length > 0 &&
        props.item.birthday.length > 0 &&
        props.item.registrationdate.length > 0
      ) {
        ctx.emit("create");
      }
    };
    return {
      create,
    };
  },
};
</script>
<style scoped></style>
