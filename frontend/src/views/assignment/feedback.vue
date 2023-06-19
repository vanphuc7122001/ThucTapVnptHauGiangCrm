<script>
import { reactive, onBeforeMount } from "vue";
import Select_Advanced from "../../components/form/select_advanced.vue";
import Evaluate from "../../services/evaluate.service";
import Task from "../../services/task.service";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update
} from "../../assets/js/common.http";
import {
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
} from "../../assets/js/common.alert";
export default {
    components: {
    Select_Advanced,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const create = () => {
      ctx.emit("create");
    };

    const evaluates = reactive({ evaluate: [] });
    const refresh = async () => {
      evaluates.evaluate = await http_getAll(Evaluate);
    };


    const handleFeedback = async ()=>{
        console.log("hello");
        console.log("id Task dang chon:", props.item._id, props.item);
        const result = await http_update(Task, props.item._id, props.item);
        console.log("ne", result);
        if (!result.error) {
            alert_success(`Sửa đánh giá`, `${result.msg}`);
            refresh();
        } else if (result.error) {
            alert_error(`Sửa đánh giá`, `${result.msg}`);
        }
    };

    onBeforeMount(() => {
      refresh();
    });


    return {
      create,
      evaluates,
      handleFeedback,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-feedback">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Phản hồi khách hàng</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="name">Đánh giá(<span style="color: red">*</span>):</label>
                <select
                    id=""
                    class="form-control"
                    required
                    v-model="item.EvaluateId"
                  >
                    <option value="" disabled selected hidden>
                      Chọn đánh giá
                    </option>
                    <option
                      v-for="evaluate in evaluates.evaluate"
                      :key="evaluate"
                      :value="evaluate._id"
                    >
                      {{ evaluate.star }}
                    </option>
                  </select>
            </div>
            <div class="form-group">
              <label for="content"
                >Nhận xét(<span style="color: red">*</span>):</label
              >
              <textarea
                id="content"
                required
                class="form-control"
                rows="5"
                v-model="item.Comment.content "
              ></textarea>
            </div>
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="handleFeedback"
              id="add"
            >
              <span>Thêm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
