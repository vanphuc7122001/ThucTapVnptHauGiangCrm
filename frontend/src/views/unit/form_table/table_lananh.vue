<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
export default {
  components: {},
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
    name_id: { type: String },
  },
  setup(props, ntx) {
    const router = useRouter();
    const get = (data) => {
      console.log("id get:", data);
      ntx.emit("update", data);
    };
    const onDelete = (data) => {
      ntx.emit("onDelete", data);
    };
    const detail = (data) => {
      router.push({ name: "unit_level", params: { id: data } });
      // ntx.emit("detail", data);
    };

    return { get, onDelete, detail };
  },
};
</script>

<template>
  <div>
    <table
      class="my-table mb-2"
      :class="[borderTableAll ? 'border-table-all' : '']"
    >
      <thead>
        <tr>
          <th></th>
          <th>STT</th>
          <th v-for="(value, index) in fields" :key="index">{{ value }}</th>
          <th v-if="activeAction == true">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td>
            <input
              :checked="item.delete"
              v-model="item.delete"
              type="checkbox"
              name=""
              id=""
            />
          </td>
          <td>{{ index + 1 }}</td>
          <td v-for="(label, index1) in labels" :key="index1">
            {{ item[label] }}
          </td>
          <td v-if="activeAction == true">
            <span
              id="view"
              class="material-symbols-outlined"
              @click="detail(item[`${name_id}`])"
              v-if="name_id != 'uni_id'"
            >
              visibility
            </span>

            <span
              class="material-symbols-outlined mx-2"
              @click="get(item[`${name_id}`])"
              id="edit"
            >
              edit
            </span>

            <span
              id="delete"
              class="material-symbols-outlined"
              @click="onDelete(item[`${name_id}`])"
            >
              delete
            </span>
          </td>
        </tr>
      </tbody>
    </table>
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
#delete {
  font-size: 22px;
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
