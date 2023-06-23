<script>
import { reactive, computed } from "vue";
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
  },
  setup(props, ntx) {},
};
</script>

<template>
  <table class="my-table mb-2" :class="[borderTableAll ? 'border-table-all' : '']">
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
        <td>{{ index + 1 }}</td>
        <td>{{ item.Customer.name }}</td>
        <td>{{ item.Cycle.name }}</td>
        <td v-for="(label, index1) in labels" :key="index1">
          {{ item[label] }}
        </td>
        <td>{{ item.Evaluate.star }}</td>
        <td>{{ item.Status_Task.name }}</td>
        <td class="" v-if="activeAction == true">
          <div class="d-flex align-items-center">
            <button
              type="button"
              class="format-btn"
              data-toggle="modal"
              data-target="#model-view"
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
            >
              <span
                id="edit"
                class="material-symbols-outlined d-flex align-content-center"
                @click="$emit('edit', item, true)"
              >
                edit
              </span>
            </button>
            <span
              id="delete"
              class="material-symbols-outlined"
              @click="$emit('delete', item._id, item)"
            >
              delete
            </span>
            <button
              type="button"
              class="mx-2 format-btn"
              data-toggle="modal"
              data-target="#modal-addAppointment"
            >
              <span
                id="appointment"
                class="material-symbols-outlined d-flex align-items-center justify-content-center"
                @click="$emit('appointmentView', item._id, item)"
              >
                schedule
              </span>
            </button>
          </div>
        </td>
        <!-- <td v-if="activeAction == true">
          <button
            type="button"
            class=""
            data-toggle="modal"
            data-target="#model-view"
          >
            <span
              id="view"
              class="material-symbols-outlined d-flex align-items-center"
              @click="$emit('view', item)"
            >
              visibility
            </span>
          </button>
          <button
            type="button"
            class="mx-2"
            data-toggle="modal"
            data-target="#model-form-wizard"
          >
            <span
              id="edit"
              class="material-symbols-outlined d-flex align-items-center justify-content-center"
              @click="$emit('edit', item, true)"
            >
              edit
            </span>
          </button>
          <span
            id="delete"
            class="material-symbols-outlined"
            @click="$emit('delete', item._id)"
          >
            delete
          </span>
          <button
            type="button"
            class="mx-2"
            data-toggle="modal"
            data-target="#modal-addAppointment"
          >
            <span
              id="appointment"
              class="material-symbols-outlined d-flex align-items-center justify-content-center"
              @click="$emit('appointment', item._id, item)"
            >
              schedule
            </span>
          </button>
        </td> -->
      </tr>
    </tbody>
  </table>
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
</style>
