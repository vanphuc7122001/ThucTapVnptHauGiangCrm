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
    activeAction: {
      type: Boolean,
      default: true,
    },
    borderTableAll: {
      type: Boolean,
      default: false,
    },
    showActionList: {
      type: Array,
      default: [true, true, true],
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
    const data = reactive({
      activeShow: -1,
    });
    return {
      data,
    };
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
          <th><span class="size-16">Stt</span></th>
          <th v-for="(value, index) in fields" :key="index">
            <span class="size-16">{{ value }}</span>
          </th>
          <!-- <th><span class="size-16">Hành động</span></th> -->
        </tr>
      </thead>
      <tbody>
        <tr class="size-16" v-for="(item, index) in items" :key="index">
          <td>
            <input type="checkbox" v-model="item.checked" name="" id="" />
          </td>
          <td class="size-16">{{ startRow + index }}</td>
          <td class="size-16" v-for="(label, index1) in labels" :key="index1">
            {{ item[label] }}
          </td>
          <td class="size-16">
            <button class="format-btn d-flex align-items-center">
              <span
                v-if="data.activeShow != index"
                @click="data.activeShow = index"
                class="material-symbols-outlined d-flex align-items-center"
              >
                arrow_right
              </span>
              <span
                v-if="data.activeShow == index"
                @click="data.activeShow = -1"
                class="material-symbols-outlined"
              >
                arrow_drop_down
              </span>
            </button>

            <div v-if="data.activeShow == index" class="">
              <p style="margin: 0;" v-for="(value, index) in item.permision" :key="index">
                {{ index+1 }}.  {{ value.name }}
              </p>
            </div>
          </td>
          <!-- <td v-if="activeAction == true">
            <div class="d-flex align-items-center">
              <button
                v-if="showActionList[0] == true"
                type="button"
                class=""
                data-toggle="modal"
                data-target="#model-view"
              >
                <span
                  id="view"
                  class="material-symbols-outlined d-flex align-items-center"
                >
                  visibility
                </span>
              </button>
              <button
                v-if="showActionList[1] == true"
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
                v-if="showActionList[2] == true"
                id="delete"
                class="material-symbols-outlined"
                @click="$emit('delete', item._id, item)"
              >
                delete
              </span>
            </div>
          </td> -->
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

.format-btn {
  background-color: var(--light);
  outline: none;
}
</style>
