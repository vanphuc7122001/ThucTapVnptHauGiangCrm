<template>
  <div>
    <table class="my-table mb-2">
      <thead>
        <tr class="">
          <!-- <th>
            <input
              type="checkbox"
              name=""
              id=""
              :checked="selectAll[0].checked == true"
              v-model="selectAll[0].checked"
              @click="$emit('selectAll', selectAll[0].checked)"
              class="d-flex align-items-center size-16"
            />
          </th> -->
          <th><span class="size-16">Stt</span></th>
          <th v-for="(value, index) in fields" :key="index">
            <span class="size-16">{{ value }}</span>
          </th>
          <!-- <th><span class="size-16">Hành động</span></th> -->
        </tr>
      </thead>
      <tbody>
        <tr class="size-16" v-for="(item, index) in items" :key="index">
          <!-- <td>
            <input
              type="checkbox"
              :checked="item.checked == true"
              v-model="item.checked"
              @click="$emit('selectOne', item._id, item)"
              class="d-flex align-items-center size-16"
            />
          </td> -->
          <td class="size-16">{{ startRow + index }}</td>
          <td class="size-16">{{ item.customer.name }}</td>
          <td class="size-16">{{ item.customer.phone }}</td>
          <td class="size-16">{{ item.customer.email }}</td>
          <td class="size-16">{{ item.cycle }}</td>
          <td class="size-16">{{ item.content }}</td>
          <td class="size-16">{{ item.status }}</td>

          <td class="size-16">{{ item.start_date }}</td>
          <td class="size-16">{{ item.end_date }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="items.length == 0" class="text-center mt-2">
      Không tồn tại bản ghi.
    </p>
  </div>
</template>

<script>
import { formatDate } from "../../assets/js/common";

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
    startRow: {
      type: Number,
      default: 1,
    },
    selectAll: {
      type: Array,
      default: [],
    },
  },
  setup(props, ntx) {
    console.log(props.items);
    const defaultCustomerType = "Thường";
    return {
      defaultCustomerType,
    };
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
