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
  },
  setup(props, ntx) {
    
  }
};
</script>

<template>
  <table class="my-table mb-2">
    <thead>
      <tr>
        <th>#</th>
        <th>Number</th>
        <th v-for="(value, index) in fields">{{ value }}</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items">
        <td><input type="checkbox" name="" id=""></td>
        <td>{{ index + 1 }}</td>
        <td v-for="(label, index1) in labels">{{ item[label] }}</td>
        <td>
          <span id="view" class="material-symbols-outlined"> visibility </span>
          <span id="edit" class="material-symbols-outlined mx-2"> edit </span>
          <span id="delete" class="material-symbols-outlined"> delete </span>
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

#view, #edit, #delete {
    font-size: 13px;
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
