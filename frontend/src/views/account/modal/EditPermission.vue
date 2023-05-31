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

    const update = () => {
      if (
        props.item.fullname.length > 0 &&
        props.item.username.length > 0 &&
        props.item.email.length > 0 
      ){ 
        ctx.emit("update", {
        per1: props.item.per1,
        per2: props.item.per2,
        per3: props.item.per3,
        per4: props.item.per4,
        per5: props.item.per5
      });
      }
    };
    return {
      update,
    };
  },
};
</script>


<template>
  <!-- The Modal -->
  <div class="modal" id="model-editpermission">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Sửa Quyền</h4>
          <button
            @click="$emit('cancel')"
            type="button"
            class="close"
            data-dismiss="modal"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form class="was-validated">
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
                v-model="item.per1"
              />
              <label for="per1">Per1</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                id="per2"
                value="Per2"
                v-model="item.per2"
              />
              <label for="per2">Per2</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                id="per3"
                value="Per3"
                v-model="item.per3"
              />
              <label for="per3">Per3</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                id="per4"
                value="Per4"
                v-model="item.per4"
              />
              <label for="per4">Per4</label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                id="per5"
                value="Per5"
                v-model="item.per5"
              />
              <label for="per5">Per5</label>
            </div>
            </div>
    
            <button
              type="button"
              class="btn btn-warning px-3 py-2"
              style="font-size: 14px"
              @click="create"
              id="edit"
            >
              <span>Edit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-modal {
  display: block;
  opacity: 1;
  pointer-events: auto;
}
</style>
