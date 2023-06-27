<script>
import { reactive, onBeforeMount, ref, watch } from "vue";
import Select_Advanced from "../../components/form/select_advanced.vue";
import Evaluate from "../../services/evaluate.service";
import Task from "../../services/task.service";
import Swal from "sweetalert2";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
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
    resetData: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    watch(
      () => props.resetData,
      async (newValue, oldValue) => {
        console.log("Thay đổi", newValue);
        await refresh();

        // const data1 = await Position.getAll();
        console.log("DT1:", cycles.cycle);
      },
      { immediate: true }
      //có props
    );
    const data = reactive({});
    const create = () => {
      ctx.emit("create");
    };

    const entryNameEval = ref("");
    const evaluates = reactive({ evaluate: [] });
    const refresh = async () => {
      evaluates.evaluate = await http_getAll(Evaluate);
      evaluates.evaluate.push({
        _id: "other",
        star: "khác",
      });
      evaluates.evaluate = evaluates.evaluate.map((value, index) => {
        return {
          ...value,
          value: value._id,
          name: value.star,
        };
      });
      console.log("evaluate", evaluates.evaluate);
    };

    const handleFeedback = async () => {
      console.log("hello");
      console.log("id Task dang chon:", props.item._id, props.item);
      props.item.fb = true;
      const result = await http_update(Task, props.item._id, props.item);
      console.log("ne", result);
      if (!result.error) {
        alert_success(`Sửa đánh giá`, `${result.msg}`);
        await refresh();
        ctx.emit("create");
      } else if (result.error) {
        alert_error(`Sửa đánh giá`, `${result.msg}`);
      }
    };
    let selectedOptionEvaluate = ref("0");
    // selectedOptionEvaluate.value = props.item.EvaluateId;
    watch(selectedOptionEvaluate, async (newValue, oldValue) => {
      if (newValue == "other") {
        const showSweetAlert = async () => {
          const { value: evaluate } = await Swal.fire({
            title: "Thêm đánh giá",
            input: "text",
            inputLabel: "Tên đánh giá",
            inputValue: "",
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return "Tên đánh giá không được bỏ trống";
              }
            },
          });

          if (evaluate) {
            console.log(evaluate);
            const res = await http_create(Evaluate, { star: evaluate });
            if (res.error) {
              alert_warning(`Đã tồn tại đánh giá `, `${evaluate}`);
              return false;
            }
            alert_success(`Đã thêm đánh giá`, `${evaluate}`);
            props.item.Evaluate.star = res.document.star;
            await refresh();
            ctx.emit("newStatus", evaluates.evaluate);
            console.log("ne", res.document.star);
            selectedOptionEvaluate.value = res.document._id;
          }
          return true;
        };
        showSweetAlert();
        selectedOptionEvaluate.value = 0;
      }
      props.item.EvaluateId = selectedOptionEvaluate;
    });

    const deleteEvaluate = async (_id) => {
      const evaluate = await http_getOne(Evaluate, _id);
      console.log("deleting", evaluate);
      const isConfirmed = await alert_delete(
        `Xoá đánh giá`,
        `Bạn có chắc chắn muốn xoá đánh giá ${evaluate.star} không ?`
      );
      console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Evaluate, _id);
        alert_success(
          `Xoá đánh giá`,
          `Bạn đã xoá thành công đánh giá ${evaluate.star} .`
        );
        refresh();
      }
    };
    const search = async (value) => {
      console.log("a", value, evaluates.evaluate);
      await refresh();
      evaluates.evaluate = evaluates.evaluate.filter((value1, index) => {
        console.log(value1, value);
        return value1.name.includes(value) || value.length == 0;
      });
      console.log("searchSlect", value.length);
    };

    onBeforeMount(() => {
      refresh();
    });

    return {
      create,
      evaluates,
      handleFeedback,
      selectedOptionEvaluate,
      deleteEvaluate,
      search,
      entryNameEval,
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
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="name">Đánh giá(<span style="color: red">*</span>):</label>

              <Select_Advanced
                style="height: 40px"
                required
                :options="evaluates.evaluate"
                :modelValue="item.Evaluate.star"
                @searchSelect="(value) => search(value)"
                @delete="(value) => deleteEvaluate(value._id)"
                @chose="
                  (value, value1) => (
                    (selectedOptionEvaluate = value), (item.Evaluate.star = value1.star)
                  )
                "
              />
            </div>
            <div class="form-group">
              <label for="content">Nhận xét(<span style="color: red">*</span>):</label>
              <textarea
                id="content"
                required
                class="form-control"
                rows="5"
                v-model="item.Comment.content"
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

<style scoped></style>
