<script>
import { reactive, computed, onMounted, onUnmounted, ref } from "vue";
export default {
  props: {
    items: {
      type: Array,
      default: [],
    },
    fields: {
      type: Array,
      default: ["Name", "Age", "Payment"],
    },
    labels: {
      type: Array,
      default: [],
    },
    actionList: {
      type: Array,
      default: [],
    },
    activeAction: {
      type: Boolean,
      default: true,
    },
    borderTableAll: {
      type: Boolean,
      default: false,
    },
    selectAll: {
      type: Array,
      default: [],
    },
    startRow: {
      type: Number,
      default: 0,
    },
    showActionList: {
      type: Array,
      default: [true, true, true, true, true],
    },
  },
  setup(props, ntx) {
    const data = reactive({
      _showAction: -1,
    });
    const selectRef = ref(null);

    const handleClickOutside = (event) => {
  
      if (!selectRef.value.contains(event.target)) {
        data._showAction = -1;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    return {
      data,
      selectRef,
    };
  },
};
</script>

<template>
  <div ref="selectRef">
    <table
      class="my-table mb-2 table-container"
      :class="[borderTableAll ? 'border-table-all' : '']"
    >
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              name=""
              id=""
              :checked="selectAll[0].checked == true"
              v-model="selectAll[0].checked"
              @click="$emit('selectAll', selectAll[0].checked)"
              class="d-flex align-items-center size-16"
            />
          </th>
          <th>Stt</th>
          <th>Khách hàng</th>
          <th>Chu kỳ</th>
          <th v-for="(value, index) in fields" :key="index">{{ value }}</th>
          <th v-if="activeAction == true">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td>
            <input
              type="checkbox"
              :checked="item.checked == true"
              v-model="item.checked"
              @click="$emit('selectOne', item._id, item)"
              class="d-flex align-items-center size-16"
            />
          </td>
          <td class="size-16">{{ startRow + index }}</td>
          <td class="size-16" width="12%">{{ item.Customer.name }}</td>
          <td class="size-16" width="8%">{{ item.Cycle.name }}</td>
          <td
            v-for="(label, index1) in labels"
            :key="index1"
            class="size-16"
            :style="{
              width: label === 'content' ? '33.5%' : '14%',
            }"
          >
            {{ item[label] }}
          </td>
          <td class="size-16">{{ item.Evaluate.star }}</td>
          <td class="size-16">{{ item.Status_Task.name }}</td>
          <td class="size-16" v-if="activeAction == true">
            <div class="" style="position: relative">
              <span
                @click="data._showAction = index"
                class="material-symbols-outlined"
                style="cursor: pointer"
                v-show="data._showAction != index || data._showAction == -1"
              >
                more_vert
              </span>
              <span
                @click="data._showAction = -1"
                class="material-symbols-outlined"
                style="cursor: pointer"
                v-if="data._showAction == index"
              >
                more_vert
              </span>
              <div
                v-if="data._showAction == index"
                class="d-flex align-items-center size-16 menu-action-child"
              >
                <button
                  type="button"
                  class="format-btn"
                  data-toggle="modal"
                  data-target="#model-view"
                  v-if="showActionList[0] == true"
                >
                  <span
                    id="view"
                    class="material-symbols-outlined d-flex align-content-center"
                    @click="$emit('view', item._id)"
                  >
                    visibility
                  </span>
                </button>
                <button
                  type="button"
                  class="mx-2 format-btn"
                  data-toggle="modal"
                  data-target="#model-form-wizard"
                  v-if="showActionList[1] == true"
                >
                  <span
                    id="edit"
                    class="material-symbols-outlined d-flex align-content-center"
                    @click="$emit('edit', item, true)"
                  >
                    edit
                  </span>
                </button>
                <button
                  type="button"
                  class="format-btn"
                  v-if="showActionList[2] == true"
                >
                  <span
                    id="delete"
                    class="material-symbols-outlined d-flex align-content-center"
                    @click="$emit('delete', item._id, item)"
                  >
                    delete
                  </span>
                </button>
                <button
                  type="button"
                  class="mx-2 format-btn"
                  data-toggle="modal"
                  data-target="#modal-addAppointment"
                  v-if="showActionList[3] == true"
                >
                  <span
                    id="appointment"
                    class="material-symbols-outlined d-flex align-items-center justify-content-center"
                    @click="$emit('appointmentView', item._id, item)"
                  >
                    schedule
                  </span>
                </button>
                <button
                  type="button"
                  class="format-btn"
                  data-toggle="modal"
                  data-target="#model-renew"
                  v-if="showActionList[4] == true"
                >
                  <span
                    id="appointment"
                    class="material-symbols-outlined d-flex align-items-center justify-content-center"
                    @click="$emit('renewtask', item, true)"
                  >
                    autorenew
                  </span>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="items.length == 0" class="text-center mt-2">
      Không tồn tại bản ghi.
    </p>
  </div>
</template>

<style scoped>
.my-table {
  width: 100%;
  border-collapse: collapse;
}

.border-table-all {
  border: 1px solid var(--gray);
}

.my-table th,
.my-table td {
  border: 1px solid var(--gray);
  border-left: 0;
  border-right: 0;
  padding: 8px;
}

.my-table th {
  font-weight: 900;
  font-size: 14px;
}

.my-table tbody tr:nth-child(even) {
  font-size: 13px;
}

#view,
#edit,
#delete,
#appointment {
  font-size: 18px;
  cursor: pointer;
  border: 1px solid var(--gray);
  border-radius: 4px;
  padding: 1px;
}
#view:hover {
  color: var(--blue);
}
#edit:hover {
  color: var(--yellow);
}
#delete:hover {
  color: var(--red);
}

.takingCare {
  color: green;
}
.takeCare {
  color: red;
}
.menu-action-child {
  position: absolute;
  left: 0;
  margin-left: -140px;
  background-color: white;
  padding: 10px 20px;
  border: 1px solid white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
.table-container {
  overflow-x: auto;
  max-width: 100%;
  width: 100%;
}
</style>
