<script>
import { reactive } from "vue";
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
    activeActionView: {
      type: Boolean,
      default: true,
    },
    borderTableAll: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ntx) {},
};
</script>

<template>
  <table
    class="my-table mb-2"
    :class="[borderTableAll ? 'border-table-all' : '']"
  >
    <thead>
      <tr>
        <th>Id</th>
        <th v-for="(value, index) in fields" :key="index">{{ value }}</th>
        <th v-if="activeActionView == true">Quản Lý</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td>{{ index + 1 }}</td>
        <td v-for="(label, index1) in labels" :key="index1">{{ item[label] }}</td>
        <td v-if="activeActionView == true" class="action-cell">
          <div class="action-container">
          <span id="view" class="material-symbols-outlined" @click="$emit('view', item._id)"> visibility </span>
          </div>
        </td>
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

#view {
  font-size: 18px;
  cursor: pointer;
  border: 1px solid var(--gray);
  border-radius: 4px;
  padding: 1px;
}
#view:hover {
  color: var(--blue);
}

</style>