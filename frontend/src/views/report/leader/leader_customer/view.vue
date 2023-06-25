<script>
import { ref } from 'vue'
import Table from '../../../../components/table/table_customer_types.vue'
export default {
  components: {
    Table
  },
  props: {
    item: {
      type: Object
    }
    ,
    itemViewCareCus: {
      type: Array
    }
  },
  setup(props, context) {

    const isActive = ref(false)

    const handleActiveCus = () => {
      isActive.value = !isActive.value
    }
    
    return {
      isActive,
      handleActiveCus
    }
  }
}
</script>


<template>
  <div class="modal" id="model-view">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Thông tin chi tiết khách hàng</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="mb-2">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#personal-info" style="margin-bottom: 0;" @click="handleActiveCus">
              Thông tin cá nhân 
            </button>
            <div v-if="isActive" id="personal-info" class="collapse my-2 border-all">
              <img :src="item.Customer.avatar" alt="" class="rounded-circle mx-auto d-block border border-dark my-3" height="100">
              <div class="d-flex justify-content-around">
                <div>
                  <p><span class="font-weight-bold">Họ khách hàng: </span> {{ item.Customer.nameCustomer }}</p>
                  <p><span class="font-weight-bold">Email khách hàng: </span> {{ item.Customer.emailCustomer }}</p>
                  <p><span class="font-weight-bold">Số điện thoại: </span> {{ item.Customer.phoneCustomer }}</p>
                </div>
                <div>
                  <p><span class="font-weight-bold">Ngày sinh khách hàng: </span> {{ item.Customer.birthdayCustomer }}</p>
                  <p><span class="font-weight-bold">Địa chỉ khách hàng: </span> {{ item.Customer.addressCustomer }}</p>
                  <p><span class="font-weight-bold">Loại khách hàng: </span> {{ item.Customer.customerType }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class=" mt-2">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#customer-type">
              Loại khách hàng
            </button>
            <div id="customer-type" class="collapse mx-2">
              Lorem ipsum dolor text....
              {{ item.Customer_Type.name }}
            </div>
          </div> -->
          <div class="mb-2">
            <button data-toggle="collapse" style="margin-bottom: 0px;" class="px-3 py-2 h6 border-none" data-target="#customer-work" @click="handleActiveCus">
              Công việc
            </button>
            <!-- Customer_Work: {
          position: item.Customer.Customer_Works[0].current_position,
          work_place: item.Customer.Customer_Works[0].current_workplace,
          work_history: item.Customer.Customer_Works[0].work_history,
          work_temp: item.Customer.Customer_Works[0].work_temp,
          companyKH: item.Customer.Customer_Works[0].Company_KH.name
        }, -->
            <div v-if="isActive" id="customer-work" class="collapse border-all my-2">
              <!-- d-flex justify-content-around align-items-center -->
              <div class="d-flex justify-content-around align-items-center" style="height: 100px;">
                <div>
                  <p><span class="font-weight-bold">Công việc hiện tại: </span> {{ item.Customer_Work.work_place }}</p>
                  <p><span class="font-weight-bold">Vị trí hiện tại: </span> {{ item.Customer_Work.position }}</p>
                </div>
                <div>
                  <p><span class="font-weight-bold">Nhiệm kỳ: </span> {{ item.Customer_Work.work_temp }}</p>
                  <p><span class="font-weight-bold">Lịch sử làm việc: </span> {{ item.Customer_Work.work_history }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#assignment" @click="handleActiveCus">
              Danh sách chăm sóc khách hàng
            </button>
            <div v-if="isActive" id="assignment" class="collapse">
             <div class="table-responsive">
              <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th>
                      <th>Nội dung chăm sóc</th>
                      <th>Tên khách hàng</th>
                      <th>Chu kì</th>
                      <th>Trạng thái</th>
                      <th>Số sao khách hàng đánh giá</th>
                      <th>Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ item.start_date }}</td>
                      <td>{{ item.end_date }}</td>
                      <td>{{ item.content }}</td>
                      <td>{{ item.Customer.name }}</td>
                      <td>{{ item.Cycle.name }}</td>
                      <td>{{ item.Status_Task.name }}</td>
                      <td>{{ item.Evaluate.star }}</td>
                      <td>{{ item.Comment == null ? 'Chưa đánh giá' : item.Comment.name }}</td>
                    </tr>
                  </tbody>
                </table>
             </div>
              <!-- <div v-for="(value, index) in item.Tasks" :key="index">
              <p> Ngày bắt đầu:  {{ value.start_date }}</p>
              <p> Ngày kết thúc: {{ value.end_date }}</p>
              <p> Nội dung: {{ value.content }}</p>
              </div> -->
            </div>
          </div>
          <div class="">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#event" @click="handleActiveCus">
              Danh sách sự kiện
            </button>
            <div v-if="isActive" id="event" class="collapse">
              <Table
                :items="item.Events"
                :fields="['Tên sự kiện']"
                :labels="['name']" 
                :borderTableAll="true"
                :showActionList="[false, false, false]"
                :activeAction="false"
                :isActiveCheckbox="false"
              />
            </div>
          </div>
          <div class="">
            <button data-toggle="collapse" class="px-3 py-2 h6 border-none" data-target="#habit" @click="handleActiveCus">
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
              />
              <!-- <div v-for="(value, index) in item.Habits" :key="index">
                <p class="text-center">
                {{ value.name }}
                </p>
              </div> -->
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