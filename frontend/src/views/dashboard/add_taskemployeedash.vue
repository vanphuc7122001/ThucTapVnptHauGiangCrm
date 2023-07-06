<script>
import { reactive, ref, watch, onMounted, watchEffect } from "vue";
import Select from "../../components/form/select.vue";
import Employee from "../../services/employee.service";
// ******
import Select_Advanced from "../../components/form/select_advanced.vue";
import Position from "../../services/position.service";
// import SelectOption from "../../components/box_lananh/select_cdu.vue";
import CenterServices from "../../services/center_vnpt.service";
import departmentsServices from "../../services/department.service";
import unitsServices from "../../services/unit.service";
import Swal from "sweetalert2";

import {
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
} from "../../assets/js/common.alert";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
} from "../../assets/js/common.http";
export default {
  components: {
    Select,
    // ***
    // SelectOption,
    Select_Advanced,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
    updateAdd: { type: String, default: "" },
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-edit">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Thêm thông tin nhân viên mới
          </h4>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            @click="closeModal"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="model-body" @click="closeModal">
          <div class="d-flex">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-id {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}
.step-content {
  border-left: 1px solid var(--gray);
}
input {
  width: 100%;
}
.active-step {
  color: blue;
}
.btn-next {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}

.btn-next:hover {
  background-color: green;
  color: white;
}

.btn-prev {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}

.btn-prev:hover {
  background-color: red;
  color: white;
}
</style>
