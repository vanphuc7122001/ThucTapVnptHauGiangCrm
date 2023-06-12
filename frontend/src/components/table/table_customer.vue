<template>
    <table
      class="my-table mb-2"
    >
      <thead>
        <tr>
          <th></th>
          <th>Stt</th>
          <th v-for="(value, index) in fields" :key="index">{{ value }}</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td><input type="checkbox" v-model="item.checked" name="" id="" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ item.Customer.name }}</td>
          <td>{{ item.Customer.email }}</td>
          <td>{{ item.Customer.phone }}</td>
          <td>{{ item.current_position }}</td>
          <td>{{ item.Company_KH.name }}</td>
          <td>{{ item.Customer.Customer_Type.name }}</td>

          <td>
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
              @click="$emit('delete', item.Customer._id, item.Company_KH._id, item)"
            >
              delete
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </template>


<script>
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
  },
  setup(props, ntx) {
    console.log(props.items);
    const defaultCustomerType = 'Thường'
    return {
      defaultCustomerType
    }
  },
};
</script>

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