<script>
import { reactive, watchEffect, ref } from "vue";
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
  },
  setup(props, ntx) {
    const checkedValues = ref([]);

    const handleCheckboxChange = (value, checked) => {
      console.log("change");
      if (checked) {
        // Checkbox được chọn, thêm giá trị vào mảng checkedValues nếu chưa tồn tại
        if (!checkedValues.value.includes(value)) {
          checkedValues.value.push(value);
        }
      } else {
        // Checkbox bị bỏ chọn, loại bỏ giá trị khỏi mảng checkedValues nếu tồn tại
        const index = checkedValues.value.indexOf(value);
        if (index > -1) {
          checkedValues.value.splice(index, 1);
        }
      }
      console.log("change", checkedValues.value);
      ntx.emit("checkbox", checkedValues.value);
    };

    // watchEffect(() => {
    //   console.log(checkedValues.value);
    // });

    return {
      handleCheckboxChange,
    };
  },
};
</script>

<template>
  <table
    class="my-table mb-2"
    :class="[borderTableAll ? 'border-table-all' : '']"
  >
    <thead>
      <tr>
        <th></th>
        <th>Stt</th>
        <th v-for="(value, index) in fields" :key="index">{{ value }}</th>
        <th v-if="activeAction == true">Hành động</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td>
          <input
            type="checkbox"
            name=""
            :id="`checkbox ${index}`"
            :value="`${item.email}`"
            @change="
              handleCheckboxChange($event.target.value, $event.target.checked)
            "
          />
        </td>
        <td>{{ index + 1 }}</td>
        <td v-for="(label, index1) in labels" :key="index1">
          {{ item[label] }}
        </td>
        <td>{{ item.Position.name }}</td>
        <td>{{ item.Unit.name }}</td>
        <td>{{ item.Unit.Department.name }}</td>
        <td>{{ item.Unit.Department.Center_VNPTHG.name }}</td>
        <td v-if="activeAction == true">
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
            data-target="#model-edit"
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
        </td>
      </tr>
      <!-- <button @click="getSelectedCheckboxes()">Lấy các checkbox đã chọn</button> -->
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
#delete {
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
</style>
