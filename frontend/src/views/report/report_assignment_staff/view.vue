<script>
import { ref } from "vue";
import Table from "../../../components/table/table_customer_types.vue";
import { formatDate } from "../../common/import";
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
    viewCareCus: {
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
      formatDate,
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
              Thông tin cá nhân khách hàng
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
                  <p><span class="font-weight-bold">Họ tên khách hàng: </span> {{ item.Customer.name }}</p>
                  <p><span class="font-weight-bold">Email mail khách hàng: </span> {{ item.Customer.email }}</p>
                  <p><span class="font-weight-bold">Số điện thoại khách hàng: </span> {{ item.Customer.phone }}</p>
                </div>
                <div>
                  <p><span class="font-weight-bold">Ngày sinh khách hàng: </span> {{ formatDate(item.Customer.birthday) }}</p>
                  <p><span class="font-weight-bold">Địa chỉ khách hàng: </span> {{ item.Customer.address }}</p>
                  <p><span class="font-weight-bold">Loại khách hàng: </span> {{ item.customerType }}</p>
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
                          <span class="font-weight-bold">Họ tên khách hàng:</span>
                          {{ item.Customer.name }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Email mail khách hàng:</span>
                          {{ item.Customer.email }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Số điện thoại khách hàng:</span>
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
                          <span class="font-weight-bold">Ngày sinh khách hàng:</span>
                          {{ formatDate(item.Customer.birthday) }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Địa chỉ khách hàng:</span>
                          {{ item.Customer.address }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Loại khách hàng:</span>
                          {{ item.customerType }}
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
              class="px-3 py-2 h6 border-none"
              data-target="#customer-work"
              style="margin-bottom: 0"
              @click="handleActiveCus"
            >
              Công việc của khách hàng
            </button>
            <div
              v-if="isActive"
              id="customer-work"
              class="collapse my-2 border-all"
              style="min-height: 100px"
            >
              <div class="container p-3">
                <div class="row">
                  <div class="col-md-6">
                    <div
                      class="d-flex flex-column justify-content-start align-items-start"
                    >
                      <div>
                        <p>
                          <span class="font-weight-bold">Công việc hiện tại:</span>
                          {{ item.Customer_Work.current_workplace }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Vị trí hiện tại:</span>
                          {{ item.Customer_Work.current_position }}
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
                          <span class="font-weight-bold">Nhiệm kỳ:</span>
                          {{ item.Customer_Work.work_temp }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Lịch sử làm việc:</span>
                          {{ item.Customer_Work.work_history }}
                        </p>
                        <p>
                          <span class="font-weight-bold">Công ty khách hàng:</span>
                          {{ item.Customer_Work.nameCompany }}
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
              <Table
                :items="viewCareCus"
                :fields="[
                  'Ngày bắt đầu',
                  'Ngày kết thúc',
                  'Nội dung chăm sóc',
                  'Tên khách hàng',
                  'Chu kì',
                  'Trạng thái',
                  'Đánh giá',
                  'Nhận xét',
                ]"
                :labels="[
                  'start_date',
                  'end_date',
                  'content',
                  'name',
                  'cycle',
                  'statusTask',
                  'star',
                  'comment',
                ]"
                :borderTableAll="true"
                :showActionList="[false, false, false]"
                :activeAction="false"
                :isActiveCheckbox="false"
                :startRow="1"
              />
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
                :startRow="1"
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
                :startRow="1"
              />
            </div>
          </div>
          <div class="">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#employee"
              @click="handleActiveCus"
            >
              Thông tin nhân viên chăm sóc khách hàng
            </button>
            <div
              v-if="isActive"
              id="employee"
              class="collapse mt-2"
              style="border: 1px solid #ccc; border-radius: 3px"
            >
              <div class="table-responsive">
                <table class="my-table mb-2 table border-table-all">
                  <thead style="max-width: 100px; overflow: auto">
                    <tr>
                      <th>Stt</th>
                      <th>Họ tên</th>
                      <th>SĐT</th>
                      <th>Email</th>
                      <th>Chức vụ</th>
                      <th>Tổ</th>
                      <th>Phòng</th>
                      <th>Trung tâm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in item.employee" :key="index">
                      <td>{{ Math.ceil(index) + 1 }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.phone }}</td>
                      <td>{{ item.email }}</td>
                      <td>{{ item.Position.name }}</td>
                      <td>{{ item.Unit.name }}</td>
                      <td>{{ item.Unit.Department.name }}</td>
                      <td>{{ item.Unit.Department.Center.name }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="item.employee.length == 0" class="text-center mt-2">
                  Không tồn tại bản ghi.
                </p>
              </div>
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
