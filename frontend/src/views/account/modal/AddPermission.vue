<template>
  <!-- The Modal -->
  <div class="modal" id="modal-addpermission">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm Quyền</h4>
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
              <label for="">Quyền:</label>
            <div class="form-check">
              <input
                type="checkbox"
                id="per1"
                value="Per1"
                v-model="data.per1"
                
              />
              <label for="per1">Per1</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                id="per2"
                value="Per2"
                v-model="data.per2"
              />
              <label for="per2">Per2</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                id="per3"
                value="Per3"
                v-model="data.per3"
                @click="selectper()"
              />
              <label for="per3">Per3</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                id="per4"
                value="Per4"
                v-model="data.per4"
              />
              <label for="per4">Per4</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                id="per5"
                value="Per5"
                v-model="data.per5"
              />
              <label for="per5">Per5</label>
            </div>
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px; float: right"
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
    const data = reactive({
      per1: false,
      per2: false,
      per3: false,
      per4: false,
      per5: false
    });
    const create = () => {
      if (
        props.item.fullname.length > 0 &&
        props.item.username.length > 0 &&
        props.item.email.length > 0
      ) {
        ctx.emit("create", {
        per1: data.per1,
        per2: data.per2,
        per3: data.per3,
        per4: data.per4,
        per5: data.per5
      });
      }
    };
    const selectper = () =>{
      data.value = true;
    }
    return {
      data,
      create,
      selectper
    };
  },
};
</script>
<style scoped></style>
