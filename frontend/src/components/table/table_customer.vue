<template>
  <div>
    <table class="my-table mb-2">
      <thead>
        <tr class="">
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
          <th v-if="activeAction"><span class="size-16">Hành động</span></th>
        </tr>
      </thead>
      <tbody>
        <tr class="size-16" v-for="(item, index) in items" :key="index">
          <td>
            <input
              type="checkbox"
              :checked="item.checked == true"
              v-model="item.checked"
              name=""
              id=""
              class="d-flex align-items-center size-16"
            />
          </td>
          <td class="size-16">{{ startRow + index }}</td>
          <td class="size-16">{{ item.Customer.name }}</td>
          <td class="size-16">{{ item.Customer.email }}</td>
          <td class="size-16">{{ item.Customer.phone }}</td>
          <td class="size-16">{{ item.current_position }}</td>
          <td class="size-16">{{ item.Company_KH.name }}</td>
          <td class="size-16">{{ item.Customer.Customer_Type.name }}</td>
  
          <td v-if="activeAction" class="">
            <div class="d-flex align-items-center">
              <button
                type="button"
                class="format-btn"
                data-toggle="modal"
                data-target="#model-view"
                v-if="showActionList[0]"
              >
                <span
                  id="view"
                  class="material-symbols-outlined d-flex align-content-center"
                  @click="$emit('view', item)"
                >
                  visibility
                </span>
              </button>
              <button
                type="button"
                class="mx-2 format-btn"
                data-toggle="modal"
                data-target="#model-edit"
                v-if="showActionList[1]"
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
                v-if="showActionList[2]"
                @click="
                  $emit('delete', item.Customer._id, item.Company_KH._id, item)
                "
              >
                delete
              </span>
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
      startRow: {
        type: Number,
        default: 1,
      },
      selectAll: {
        type: Array,
        default: [],
      },
      activeAction: {
        type: Boolean,
        default: true,
      },
      showActionList: {
        type: Array,
        default: [true, true, true],
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