<script>
import { ref } from "vue";
import Table from "../../components/table/table-appointment.vue";
import EditAppointment from "../../views/appointment/edit.vue";
import { formatDate } from "../common/import";
export default {
  components: {
    Table,
    EditAppointment,
  },
  props: {
    viewValue: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    const isActive = ref(false);

    const handleActiveCus = () => {
      isActive.value = !isActive.value;
    };

    const showSweetAlert = async () => {
      const { value: formValues } = await Swal.fire({
        title: "Chỉnh sửa ",
        html: `
        <input id="my-input1" class="swal2-input form-control  m-3" style="width:92%" type="text" placeholder="Tên tổ">
        <input id="my-input" class="swal2-input form-control  m-3" style="width:92%" type="text" placeholder="Tên tổ">
        <input id="my-input" class="swal2-input form-control  m-3" style="width:92%" type="text" placeholder="Tên tổ">
        <select id="my-select-center" class="swal2-input form-control  ml-3 mb-3 mx-2" style="width:92%">
        <option value="">Trung tâm</option>
        ${centers.center
          .map(
            (option) => `<option value="${option._id}"
            ${option._id == selectedOptionCenter.value ? "selected" : ""}
            >${option.name}</option>`
          )
          .join("")}
      </select>
      <select id="my-select-dep" class="swal2-input form-control  ml-3  mx-2" style="width:92%" >
        <option value="">Phòng</option>

      </select>
      </select>
      <input id="my-input" class="swal2-input form-control  m-3" style="width:92%" type="text" placeholder="Tên tổ">
    `,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          const selectedOptionCenter = document.getElementById("my-select-center").value;
          const selectedOptionDep = document.getElementById("my-select-dep").value;

          const inputValue = document.getElementById("my-input").value;
          if (!selectedOptionCenter || !inputValue || !selectedOptionDep) {
            Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
          }

          return {
            selectedOptionCenter,
            selectedOptionDep,
            inputValue,
          };
        },
        didOpen: async () => {
          const center = document.getElementById("my-select-center");
          const dep = document.getElementById("my-select-dep");

          const Id = center.value;
          departments.department =
            (await departmentsServices.findAllDepOfACenter(Id)) || [];

          dep.innerHTML = `
          <option value="">Phòng</option>
          ${departments.department
            .map(
              (option) =>
                `<option value="${option._id}"
                ${option._id == selectedOptionDepartment.value ? "selected" : ""}

                >${option.name}</option>`
            )
            .join("")}
        `;
          center.addEventListener("change", async () => {
            const Id = center.value;
            departments.department =
              (await departmentsServices.findAllDepOfACenter(Id)) || [];

            dep.innerHTML = `

          ${departments.department
            .map(
              (option) =>
                `<option value="${option._id}"

                >${option.name}</option>`
            )
            .join("")}
        `;
          });
        },
      });

      if (formValues) {
        // Xử lý giá trị selectedOption và giá trị inputValue
        console.log("Selected Option Center:", formValues.selectedOptionCenter);
        console.log("Selected Option dep:", formValues.selectedOptionDep);

        console.log("Input Value:", formValues.inputValue);
        const document = await unitsServices.create({
          departmentId: formValues.selectedOptionDep,
          name: formValues.inputValue,
        });
        if (document.error) {
          alert_warning(`Đã tồn tại  `, `${formValues.inputValue}`);
          return;
        }
        alert_success(`Đã thêm `, `${formValues.inputValue}`);

        await refresh("unit");
        units.unit.push({ _id: "other", name: "khác" });

        ctx.emit("newUnit", units.unit);
        selectedOptionUnit.value = document.document._id;
        data.modelUnit = document.document.name;
      }
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
          <h4 class="modal-title">Thông tin chi tiết phân công</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="mt-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#personal-info"
              style="margin-bottom: 0"
              @click="handleActiveCus"
            >
              Thông tin phân công
            </button>
            <div v-if="isActive" id="personal-info" class="collapse my-3 border-all">
              <div
                class="d-flex justify-content-around row mx-2"
                style="margin-top: 12px"
              >
                <div class="col-6">
                  <p>
                    <span class="font-weight-bold">Khách hàng: </span>
                    {{ viewValue.Customer.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Ngày bắt đầu: </span>
                    {{ viewValue.start_date }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Ngày kết thúc: </span>
                    {{ viewValue.end_date }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Chu kỳ chăm sóc: </span>
                    {{ viewValue.Cycle.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Đánh giá: </span>
                    {{ viewValue.Evaluate.star }}
                  </p>
                </div>
                <div class="col-6">
                  <p>
                    <span class="font-weight-bold">Trạng thái: </span>
                    {{ viewValue.Status_Task.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Nội dung chăm sóc: </span>
                    {{ viewValue.content }}
                  </p>

                  <p>
                    <span class="font-weight-bold">Lưu ý: </span>
                    {{ viewValue.note }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Nhận xét: </span>
                    {{ viewValue.Comment.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#customer-work"
              @click="handleActiveCus"
              style="margin-bottom: 0"
            >
              Thông tin khách hàng
            </button>
            <div v-if="isActive" id="customer-work" class="collapse border-all my-3">
              <img
                :src="viewValue.Customer.avatar"
                alt=""
                class="rounded-circle mx-auto d-block border border-dark my-3"
                height="100"
              />
              <div
                class="d-flex justify-content-around align-items-center"
                style="height: 100px"
              >
                <div>
                  <p>
                    <span class="font-weight-bold">Khách hàng: </span>
                    {{ viewValue.Customer.name }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Ngày sinh: </span>
                    {{ viewValue.Customer.birthday }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Loại khách hàng: </span>
                    {{ viewValue.Customer.Customer_Type.name }}
                  </p>
                </div>
                <div>
                  <p>
                    <span class="font-weight-bold">Địa chỉ: </span>
                    {{ viewValue.Customer.address }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Số điện thoại: </span>
                    {{ viewValue.Customer.phone }}
                  </p>
                  <p>
                    <span class="font-weight-bold">Email:</span>
                    {{ viewValue.Customer.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <button
              style="margin-bottom: 0px"
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#assignment"
              @click="handleActiveCus"
            >
              Danh sách nhân viên phụ trách
            </button>
            <div v-if="isActive" id="assignment" class="collapse my-3">
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
                    <tr v-for="(item, index) in viewValue.Employees" :key="index">
                      <td class="size-16">{{ Math.ceil(index) + 1 }}</td>
                      <td class="size-16">{{ item.name }}</td>
                      <td class="size-16">{{ item.phone }}</td>
                      <td class="size-16">{{ item.email }}</td>
                      <td class="size-16">{{ item.Position.name }}</td>
                      <td class="size-16">{{ item.Unit.name }}</td>
                      <td class="size-16">{{ item.Unit.Department.name }}</td>
                      <td class="size-16">
                        {{ item.Unit.Department.Center.name }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="viewValue.Employees.length == 0" class="text-center mt-2">
                  Không tồn tại bản ghi.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#event"
              @click="handleActiveCus"
            >
              Danh sách lịch hẹn
            </button>
            <div v-if="isActive" id="event" class="collapse mt-2">
              <!-- <table
                class="my-table mb-2 table border-table-all"
              >
                <thead style="max-width: 100px; overflow: auto;">
                  <tr>
                    <th>Stt</th>
                    <th>Khách hàng</th>
                    <th>Ngày hẹn</th>
                    <th>Nội dung</th>
                    <th>Địa điểm</th>
                    <th>Lưu ý</th>
                    <th>Trạng thái cuộc hẹn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in viewValue.Appointments" :key="index">
                    <td>{{Math.ceil(index) + 1 }}</td>
                    <td>{{ viewValue.Customer.name }}</td>
                    <td>{{ item.date_time }}</td>
                    <td>{{ item.content }}</td>
                    <td>{{ item.place }}</td>
                    <td>{{ item.note }}</td>
                    <td>{{ item.Status_App.name}}</td>
                  </tr>
                </tbody>
              </table>  -->
              <Table
                :items="viewValue.Appointments"
                :cus="viewValue.Customer.name"
                :fields="['Ngày hẹn', 'Địa điểm', 'Nội dung lịch hẹn', 'Chú thích']"
                :labels="['date_time', 'place', 'content', 'note']"
                :activeAction="false"
                :activeCheck="false"
                :borderTableAll="true"
              />

              <!-- <p v-if="viewValue.Appointments.length == 0" class="text-center mt-2">Không tồn tại bản ghi.</p> -->
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

.border-table-all {
  border: 1px solid var(--gray);
}
.border-all {
  border: 1px solid #ccc;
  border-radius: 5px;
}
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

.my-table tbody tr:nth-child(even) {
  font-size: 13px;
}
.modal-parent {
  position: relative;
}
</style>
