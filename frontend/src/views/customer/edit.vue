<script>
import {
  reactive,
  Customer_Types,
  onBeforeMount,
  http_getAll,
  alert_success,
  alert_error,
  http_create,
  http_deleteOne,
  http_getOne,
  alert_delete,
  Company_KH,
  Customer_Work,
  Customer,
  Event,
  http_update,
  ref,
} from "../common/import";

import Swal from "sweetalert2";
import Select_Advanced from "../../components/form/select_advanced.vue";

export default {
  components: {
    Select_Advanced,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {

    const data = reactive({
      imgSrc: null,
      stepList: [
        {
          _id: 1,
          name: "Thông tin",
        },
        {
          _id: 2,
          name: "Công việc",
        },
      ],
      activeStep: 1,
      dataSelect: null,
      items: null,
      modelValue: "",
      customer: null,
      event: null,
    });

    // biến kiểm tra người dùng có upload ảnh lên không
    const isImageUploaded = ref(false);

    // method
    const refresh = async () => {
      const cusTypes = await http_getAll(Customer_Types);
      const company = await http_getAll(Company_KH);
      const customer = await http_getAll(Customer);
      const event = await http_getAll(Event);
      data.items = [
        ...company.documents,
        {
          _id: "other",
          name: "khác",
        },
      ];
      data.dataSelect = cusTypes.documents;
      data.customer = customer.documents;
      data.event = event.documents;
    };

    const onFileChange = (event) => {

      props.item.Customer.avatar = event.target.files[0];

      // handle display img
      const files = event.target.files[0];
      if (files && files.length > 0) {
        isImageUploaded.value = true;
      } else {
        isImageUploaded.value = false;
      }
   
      const reader = new FileReader();

     

      reader.onload = (event) => {
        data.imgSrc = event.target.result;
      };



      reader.readAsDataURL(files);
    };
    const handleAddCustometType = async () => {
      if (props.item.Customer_Type._id == "Add") {
        const { value: customerType, dismiss } = await Swal.fire({
          title: "Thêm loại khách hàng",
          input: "text",
          inputLabel: "Tên loại khách hàng",
          inputValidator: (value) => {
            if (!value) {
              return "Bạn không được phép để trường này trống!";
            }
          },
          showCancelButton: true,
          cancelButtonText: "Cancel",
          allowOutsideClick: false,
          didClose: () => {
            if (dismiss === "cancel") {
              props.item.Customer_Type._id = "1";
              refresh();
            }
          },
        });

        if (customerType) {
          const res = await http_create(Customer_Types, { name: customerType });
          if (res.error) {
            alert_error(`Thêm loại khách hàng`, `${res.msg}`);
          } else {
            props.item.Customer_Type._id = res.document._id;
            refresh();
            alert_success(
              `Thêm loại khách hàng`,
              `Loại khách hàng ${customerType} đã được tạo thành công.`
            );
          }
        }
      }
    };

    const searchSelect = async (value) => {
      await refresh(),
        (data.items = data.items.filter((value1, index) => {
          
          return value1.name.includes(value) || value.length == 0;
        }))
       
    };

    const choosed = async (_id) => {
      if (_id === "other") {
        const { value: companyName } = await Swal.fire({
          title: "Thêm công ty",
          input: "text",
          inputLabel: "Tên công ty",
          inputValidator: (value) => {
            if (!value) {
              return "Bạn không được phép để trường này trống!";
            }
          },
        });

        const res = await http_create(Company_KH, { name: companyName });
        if (res.error) {
          alert_error(`Lổi`, `${res.msg}`);
        } else {
          data.modelValue = companyName;
          refresh();
          props.item.Company_KH._id = res.document._id;
        
          alert_success(`Thành công`, `Công ty ${companyName}  đã được tạo thành công.`);
        }
      } else {
        const rs = await http_getOne(Company_KH, _id);
        data.modelValue = rs.name;
        props.item.Company_KH._id = _id;
        
      }
    };

    const deleted = async (item) => {
      const isConfirmed = await alert_delete(
        `Xoá`,
        `Bạn có chắc chắn muốn xoá công ty này không ?`
      );

      if (isConfirmed) {
        const result = await http_deleteOne(Company_KH, item._id);
        if (result.error) {
          alert_error("Lổi", result.msg);
        } else {
          alert_success(`Thành công`, result.msg);
          data.modelValue = "--Chọn--";
          refresh();
        }
      }
    };

    const update = async (event) => {
      event.preventDefault();
      let isCheck = false;
      refresh();
      if (isCheck == true) {
        return alert_error(
          "Lổi",
          `Thông tin khách hàng ${props.item.Customer.name} chưa được thay đổi.`
        );
      } else {
        const formData = new FormData();
        if (isImageUploaded.value == false) {
          formData.append("avatar", props.item.Customer.avatar);
        } 
        formData.append("name", props.item.Customer.name);
        formData.append("birthday", props.item.Customer.birthday);
        formData.append("address", props.item.Customer.address);
        formData.append("phone", props.item.Customer.phone);
        formData.append("email", props.item.Customer.email);
        formData.append("customerTypesId", props.item.Customer_Type._id);

        const res = await http_update(Customer, props.item.Customer._id, formData);
        if (res.error) {
          alert_error(`Lổi`, res.msg);
        } else {
          const object = {
            customerId: props.item.Customer._id,
            current_workplace: props.item.current_workplace,
            work_history: props.item.work_history,
            current_position: props.item.current_position,
            work_temp: props.item.work_temp ? props.item.work_temp : " ",
            companyId: props.item.Company_KH._id,
          };

          const result = await http_update(Customer_Work, props.item._id, object);
          if (result.error) {
            alert_error(`Lổi`, result.msg);
          } else {
            alert_success("Thành công", result.msg);
            ctx.emit("refresh_customer");
          }
        }
      }
    };

    // life cycle
    onBeforeMount(() => {
      refresh();
    });
    return {
      data,
      onFileChange,
      handleAddCustometType,
      searchSelect,
      choosed,
      deleted,
      update,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-edit">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 18px">Sửa thông tin khách hàng</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="model-body" style="min-height: 300px">
          <div class="d-flex">
            <!-- steps -->
            <div class="d-flex flex-column" style="height: 100%">
              <div
                class="d-flex mt-3 mx-3"
                v-for="(value, index) in data.stepList"
                :key="index"
              >
                <span
                  @click="data.activeStep = index + 1"
                  class="step-id px-3 py-2"
                  :class="[data.activeStep == index + 1 ? 'active-step' : '']"
                  >{{ value._id }}</span
                >
                <span
                  class="d-flex align-items-center px-3"
                  :class="[data.activeStep == index + 1 ? 'active-step' : '']"
                  >{{ value.name }}</span
                >
              </div>
            </div>
            <!-- form -->
            <div
              class="d-flex flex-grow-1 flex-column step-content px-3 my-3"
              style="width: 10000px"
            >
              <form action="" class="was-validated" style="width: 100%" method="put">
                <!--begin  page 1 -->
                <div v-if="data.activeStep == 1" class="page-1">
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="name">Tên (<span style="color: red">*</span>)</label>
                      <input
                        type="text"
                        class="form-control"
                        id="name"
                        v-model="item.Customer.name"
                        required
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="birthdate"
                        >Ngày sinh (<span style="color: red">*</span>)</label
                      >
                      <input
                        type="date"
                        class="form-control"
                        id="birthdate"
                        v-model="item.Customer.birthday"
                        required
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="address"
                      >Địa chỉ (<span style="color: red">*</span>)</label
                    >
                    <textarea
                      name=""
                      class="form-control"
                      v-model="item.Customer.address"
                      required
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label for="phone">Sdt (<span style="color: red">*</span>)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="phone"
                      v-model="item.Customer.phone"
                      required
                      disabled
                    />
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="email">Email (<span style="color: red">*</span>)</label>
                      <input
                        type="text"
                        class="form-control"
                        id="email"
                        v-model="item.Customer.email"
                        required
                        disabled
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="type">
                        Loại khách hàng (<span style="color: red">*</span>)
                      </label>
                      <select
                        id="type"
                        class="form-control"
                        @click="handleAddCustometType"
                        v-model="item.Customer_Type._id"
                      >
                        <option value="1" style="">--Chọn--</option>
                        <option
                          v-for="(value, index) in data.dataSelect"
                          :key="index"
                          :value="value._id"
                        >
                          {{ value.name || item.Customer_Type.name }}
                        </option>
                        <option value="Add">Thêm</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <label for="wor_work_history">Avatar</label>
                      <input
                        type="file"
                        class="form-control"
                        name="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        :maxFileSize="1000000"
                        ref="fileInput"
                        @change="onFileChange"
                      />
                    </div>
                    <div class="col">
                      <img
                        v-if="!data.imgSrc"
                        :src="item.Customer.avatar"
                        alt="Ảnh củ"
                        height="100"
                      />
                      <img :src="data.imgSrc" alt="" height="100" />
                    </div>
                  </div>

                  <div class="form">
                    <div class="form-group">
                      <label for="wor_work_history"
                        >Công ty (<span style="color: red">*</span>)</label
                      >
                      <Select_Advanced
                        style="height: 40px"
                        :modelValue="data.modelValue || item.Company_KH.name"
                        :options="data.items"
                        @searchSelect="searchSelect"
                        @delete="deleted"
                        @chose="choosed"
                      />
                    </div>
                  </div>
                </div>
                <!--end  page 1 -->

                <!--begin page 2 -->
                <div v-if="data.activeStep == 2" class="page-2">
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="wor_current_workplace"
                        >Nơi đang công tác(<span style="color: red">*</span>)</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="wor_current_workplace"
                        v-model="item.current_workplace"
                        required
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="wor_current_position"
                        >Chức vụ đang công tác(<span style="color: red">*</span>)</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="wor_current_position"
                        v-model="item.current_position"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="wor_work_history"
                      >Lịch sử công tác(<span style="color: red">*</span>)</label
                    >
                    <textarea
                      name=""
                      class="form-control"
                      required
                      v-model="item.work_history"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label for="wor_work_temp">Nhiệm kỳ</label>
                    <input
                      type="text"
                      class="form-control"
                      id="wor_work_temp"
                      v-model="item.work_temp"
                      required
                      style="border-color: #28a745"
                    />
                  </div>
                </div>
                <!--end page 2 -->

                <button
                  type="submit"
                  v-if="data.activeStep == data.stepList.length"
                  @click="update"
                  class="btn btn-primary"
                >
                  Cập nhật
                </button>
              </form>

              <div class="d-flex justify-content-end mt-3">
                <span
                  v-if="data.activeStep >= 1 && data.activeStep < data.stepList.length"
                  class="btn-next d-flex align-items-center px-3 py-1 mx-2"
                  @click="data.activeStep = data.activeStep + 1"
                  >Tiếp tục
                  <span class="material-symbols-outlined d-flex align-items-center">
                    navigate_next
                  </span>
                </span>
                <span
                  v-if="data.activeStep > 1 && data.activeStep <= data.stepList.length"
                  class="btn-prev d-flex align-items-center px-3 py-1"
                  @click="data.activeStep = data.activeStep - 1"
                  ><span class="material-symbols-outlined d-flex align-items-center mx-2">
                    navigate_before </span
                  >Quay lại</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-id {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}

.step-content {
  border-left: 1px solid var(--gray);
}

input {
  width: 100%;
}

.active-step {
  color: blue;
}

.btn-next {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}

.btn-next:hover {
  background-color: green;
  color: white;
}

.btn-prev {
  border: 1px solid var(--gray);
  border-radius: 5px;
  cursor: pointer;
}

.btn-prev:hover {
  background-color: red;
  color: white;
}
@media screen and (min-width: 739px) and (max-width: 992px) {
  .modal-content {
    width: 200%;
    margin-left: -50%;
  }
}
</style>
