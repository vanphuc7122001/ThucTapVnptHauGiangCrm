<script>
import { ref } from "vue";
import Table from "../../components/table/table_customer_types.vue";
export default {
  components: {
    Table,
  },
  props: {
    item: {
      type: Object,
    },
    itemViewCareCus: {
      type: Array,
    },
    Events: {
      type: Array,
    },
  },
  setup(props, context) {
    const isActive = ref(false);

    const handleActiveCus = () => {
      isActive.value = !isActive.value;
    };

    return {
      isActive,
      handleActiveCus,
    };
  },
};
</script>

<template>
  <div class="modal" id="model-view">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Thông tin chi tiết khách hàng</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="mb-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#personal-info"
              style="margin-bottom: 0"
              @click="handleActiveCus"
            >
              Thông tin cá nhân
            </button>
            <div v-if="isActive" id="personal-info" class="collapse my-2 border-all">
              <img
                :src="item.Customer.avatar"
                alt=""
                class="rounded-circle mx-auto d-block border border-dark my-3"
                height="100"
              />
              <!-- <div class="d-flex justify-content-around">
                <div>
                  <p><span class="font-weight-bold">Họ tên: </span> {{ item.Customer.name }}</p>
                  <p><span class="font-weight-bold">Email: </span> {{ item.Customer.email }}</p>
                  <p><span class="font-weight-bold">SDT: </span> {{ item.Customer.phone }}</p>
                </div>
                <div>
                  <p><span class="font-weight-bold">Ngày sinh: </span> {{ item.Customer.birthday }}</p>
                  <p><span class="font-weight-bold">Loại: </span> {{ item.Customer_Type.name }}</p>
                  <p><span class="font-weight-bold">Địa chỉ: </span> {{ item.Customer.address }}</p>
                </div>
              </div> -->
              <div class="container">
                <div class="row">
                  <div class="col-md-6">
                    <div
                      class="d-flex flex-column justify-content-start align-items-start"
                    >
                      <div>
                        <p>
                          <span class="font-weight-bold">Họ tên:</span>
                          {{ item.Customer.name }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Email:</span>
                          {{ item.Customer.email }}
                        </p>
                        <p>
                          <span class="font-weight-bold">SDT:</span>
                          {{ item.Customer.phone }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div
                      class="d-flex flex-column justify-content-start align-items-start"
                    >
                      <div>
                        <p>
                          <span class="font-weight-bold">Ngày sinh:</span>
                          {{ item.Customer.birthday }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Loại:</span>
                          {{ item.Customer_Type.name }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Địa chỉ:</span>
                          {{ item.Customer.address }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <button
              data-toggle="collapse"
              style="margin-bottom: 0px"
              class="px-3 py-2 h6 border-none"
              data-target="#customer-work"
              @click="handleActiveCus"
            >
              Công việc
            </button>
            <div
              v-if="isActive"
              id="customer-work"
              class="collapse border-all my-2"
              style="min-height: 100px"
            >
              <div class="container p-3">
                <div class="row">
                  <div class="col-md-6">
                    <div
                      class="d-flex flex-column justify-content-center align-items-start"
                    >
                      <div>
                        <p>
                          <span class="font-weight-bold">Công việc hiện tại:</span>
                          {{ item.current_workplace }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Vị trí hiện tại:</span>
                          {{ item.current_position }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div
                      class="d-flex flex-column justify-content-center align-items-start"
                    >
                      <div>
                        <p>
                          <span class="font-weight-bold">Nhiệm kỳ:</span>
                          {{ item.work_temp }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Lịch sử làm việc:</span>
                          {{ item.work_history }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Công ty khách hàng:</span>
                          {{ item.Company_KH.name }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#assignment"
              @click="handleActiveCus"
            >
              Danh sách chăm sóc khách hàng
            </button>
            <div v-if="isActive" id="assignment" class="collapse">
              <div class="table-responsive">
                <Table
                  :items="itemViewCareCus"
                  :fields="[
                    'Ngày bắt đầu',
                    'Ngày kết thúc',
                    'Nội dung chăm sóc',
                    'Tên khách hàng',
                    'Chu kì',
                    'Trạng thái',
                    'Sao',
                    'Đánh giá',
                  ]"
                  :labels="[
                    'start_date',
                    'end_date',
                    'content',
                    'customerName',
                    'cycleName',
                    'statusName',
                    'EvaluateStar',
                    'comment',
                  ]"
                  :borderTableAll="true"
                  :showActionList="[false, false, false]"
                  :activeAction="false"
                  :isActiveCheckbox="false"
                  :startRow="0"
                />
              </div>
            </div>
          </div>
          <div class="">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#event"
              @click="handleActiveCus"
            >
              Danh sách sự kiện
            </button>
            <div v-if="isActive" id="event" class="collapse">
              <Table
                :items="Events"
                :fields="['Tên sự kiện', 'Thời gian diển ra', 'Nội dung']"
                :labels="['name', 'time_duration', 'content']"
                :borderTableAll="true"
                :showActionList="[false, false, false]"
                :activeAction="false"
                :isActiveCheckbox="false"
                :startRow="0"
              />
            </div>
          </div>
          <div class="">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#habit"
              @click="handleActiveCus"
            >
              Danh sách thói quen khách hàng
            </button>
            <div v-if="isActive" id="habit" class="collapse mt-2">
              <Table
                :items="item.Habits"
                :fields="['Tên thói quen']"
                :labels="['name']"
                :borderTableAll="true"
                :showActionList="[false, false, false]"
                :activeAction="false"
                :isActiveCheckbox="false"
                :startRow="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-none {
  outline: none;
  border: none;
}

.border-all {
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
