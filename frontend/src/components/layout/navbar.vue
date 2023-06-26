<script>
import { defineEmits, inject, ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import socket from "../../../socket";
import employeeService from "../../services/employee.service";
import taskService from "../../services/task.service";
import notificationService from "../../services/notification.service";
import { formatDateTime } from "../../assets/js/common";
// import Add1 from "./modal.vue";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
} from "../../assets/js/common.http";
import {
  alert_success,
  alert_error,
  alert_delete,
  alert_warning,
  alert_info,
  alert_noti,
} from "../../assets/js/common.alert";
export default {
  props: {},
  computed: {
    sortedNotifications() {
      return this.data.Notice.documents.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    },
  },
  setup(props, ctx) {
    const data = reactive({
      employeeName: sessionStorage.getItem("employeeName"),
      role: sessionStorage.getItem("role"),
      Notice: {},
      customers: [],
      selectedItem: {},
      TaskLD: [],
      TaskLDE: [],
    });

    // const emit = inject('emit');
    const updateMenuResponsive = () => {
      console.log("starting");
      ctx.emit("updateMenuResponsive", "true");
    };
    const hasNotification = ref(false);
    const showNotification = ref(false);
    const count = ref(0);

    const isRead = async (item) => {
      data.selectedItem = item;
      if (item.isRead == false) {
        item.isRead = true;
        const item1 = await http_update(notificationService, item._id);
        if (count.value > 0) count.value--;
      }
      alert_noti(
        "Chi Tiết Thông Báo",
        "Từ: " +
          `${item.sender == null ? "Hệ thống" : item.sender}` +
          "\n" +
          "Tiêu đề: " +
          item.title +
          "\n" +
          "Nội dung: " +
          item.content +
          "\n" +
          "Được tạo lúc: " +
          formatDateTime(item.createdAt)
      );
    };

    const deleteOne = async (_id) => {
      const notification = await http_getOne(notificationService, _id);
      const result = await http_deleteOne(notificationService, _id);
      refresh();
      if (count.value > 0) count.value--;
    };

    const deleteAll = async () => {
      const _idEmployee = sessionStorage.getItem("employeeId");
      const notification = await http_getOne(notificationService, _idEmployee);
      const isConfirmed = await alert_delete(
        `Xoá thông báo`,
        `Bạn có chắc chắn muốn xoá tất cả thông báo không ?`
      );
      if (isConfirmed == true) {
        const result = await notificationService.deleteAll(_idEmployee);
        alert_success(`Xoá thông báo`, `Bạn đã xoá thành công tất cả thông báo`);
        refresh();
        count.value = 0;
      }
    };

    const refresh = async () => {
      const _idEmployee = sessionStorage.getItem("employeeId");
      data.List = await employeeService.get(_idEmployee);
      data.Notice = await notificationService.get(_idEmployee);
      count.value = 0;
      for (const value of data.Notice.documents) {
        if (value.isRead == false) {
          count.value++;
        }
      }
    };

    const token = sessionStorage.getItem("token");
    const check = async (token) => {
      if (token) {
        const _idEmployee = sessionStorage.getItem("employeeId");
        const _nameEmployee = sessionStorage.getItem("employeeName");
        const object = {
          _id: _idEmployee,
          name: _nameEmployee,
        };
        socket.on("notiTask", async () => {
          const _idEmployee = sessionStorage.getItem("employeeId");
          data.Notice = await notificationService.get(_idEmployee);
          hasNotification.value = true;
          // for (let i = 0; i <= data.Notice.documents.length; i++) {
          //   if (data.Notice.documents[i].isRead == false)
          //     count.value++
          // }
          count.value = 0;
          for (const value of data.Notice.documents) {
            if (value.isRead == false) {
              count.value++;
            }
          }
        });
        const employees = await http_getOne(employeeService, _idEmployee);
        if (employees.Tasks != null) {
          const Tasks = employees.Tasks;
          Tasks.map((value, index) => {
            data.customers.push(value.Customers);
          });
          socket.emit("birthday", data.customers, _idEmployee, _nameEmployee);
        }

        const TasksLD = await http_getAll(taskService);
        for (const value of TasksLD) {
          const TasksLDE = await http_getOne(taskService, value._id);
          if (_idEmployee == value.leaderId) {
            data.TaskLD.push(TasksLDE);
          }
        }
        socket.emit("cycleCus", data.TaskLD);
        socket.emit("lateCus", data.TaskLD);
      }
    };

    onMounted(async () => {
      const _idEmployee = sessionStorage.getItem("employeeId");
      data.Notice = await notificationService.get(_idEmployee);
      count.value = 0;
      for (const value of data.Notice.documents) {
        if (value.isRead == false) {
          count.value++;
        }
      }
      // alert_info(`Chi Tiết Thông Báo`, `aca`)
    });

    const toggleNotification = () => {
      showNotification.value = !showNotification.value;
      hasNotification.value = false;
    };

    const clearNotification = () => {
      showNotification.value = false;
    };

    const getAvatarUrl = (name) => {
      if (name) {
        const words = name.split(" ");
        const lastWord = words[words.length - 1];
        const initials = lastWord.charAt(0).toUpperCase();
        const color = getAvatarColor(initials);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const size = 50;

        canvas.width = size;
        canvas.height = size;

        context.beginPath();
        context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();

        context.font = `${size / 2}px sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#FFFFFF";
        context.fillText(initials, size / 2, size / 2);

        return canvas.toDataURL();
      }
      return "";
    };

    const getAvatarColor = (initials) => {
      const colors = [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFC107",
        "#FF9800",
        "#FF5722",
      ];
      const index = initials.charCodeAt(0) % colors.length;
      return colors[index];
    };

    // In hoa ký tự đầu
    const capitalizeFirstLetter = (string) => {
      const words = string.split(" ");
      const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      return capitalizedWords.join(" ");
    };
    const employeeName = capitalizeFirstLetter(data.employeeName);
    const roleName = capitalizeFirstLetter(data.role);

    // logout
    const showDropdown = ref(false);
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };
    const router = useRouter();

    const logout = async () => {
      const isConfirmed = await alert_delete(
        "Đăng xuất",
        "Bạn có chắc chắn muốn đăng xuất?"
      );
      if (isConfirmed == true) {
        // Xóa dữ liệu trong sessionStorage
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("employeeId");
        sessionStorage.removeItem("employeeName");
        sessionStorage.removeItem("role");
        // Chuyển hướng đến trang đăng nhập
        router.push({ name: "Login" });
      }
    };

    check(token);

    return {
      employeeName,
      roleName,
      logout,
      toggleDropdown,
      showDropdown,
      getAvatarUrl,
      getAvatarColor,
      updateMenuResponsive,
      hasNotification,
      clearNotification,
      count,
      toggleNotification,
      showNotification,
      data,
      deleteOne,
      deleteAll,
      isRead,
      formatDateTime,
    };
  },
};
</script>

<template>
  <nav class="w-100 d-flex align-items-center justify-content-between border-nav">
    <a class="text-dark h5 my-auto d-none d-xl-block ml-3">PERSONAL CRM SYSTEM</a>
    <a class="d-xl-none d-sm-block text-dark h5 my-auto"
      ><span class="material-symbols-outlined cursor-pointer" @click="$emit('showMenu')">
        menu
      </span></a
    >
    <div class="d-flex align-content-center justify-content-between">
      <a class="text-dark d-flex align-items-center"
        ><span class="material-symbols-outlined cursor-pointer"> search </span></a
      >
      <a class="text-dark d-flex align-items-center mx-2"
        ><span class="material-symbols-outlined cursor-pointer"> translate </span></a
      >
      <a class="text-dark d-flex align-items-center"
        ><span class="material-symbols-outlined cursor-pointer"> light_mode </span></a
      >
      <a
        class="text-dark d-flex align-items-center mx-2 notification-icon"
        @click="toggleNotification"
      >
        <span class="material-symbols-outlined cursor-pointer"> notifications </span>
        <span class="notification-dot">{{ count }}</span>
      </a>
      <div v-if="showNotification" class="notification-dropdown">
        <h6 class="font-weight-bold mb-4">THÔNG BÁO</h6>
        <div
          v-for="item in sortedNotifications"
          :key="item"
          style="align-items: center"
          class="d-flex justify-content-between mb-3 line"
        >
          <!-- Notification details -->
          <p @click="isRead(item)" class="NoticeDetails">
            <strong>{{ item.title }}</strong>
            <br /><strong>{{ item.sender }}</strong> {{ item.content }} <br />{{
              formatDateTime(item.createdAt)
            }}
          </p>

          <!-- Notification icons -->
          <p class="notify-icon">
            <span
              :style="{ color: item.isRead ? 'gray' : 'blue' }"
              style="font-size: 20px"
              class="material-symbols-outlined"
            >
              fiber_manual_record
            </span>
            <span
              style="font-size: 20px; color: black; cursor: pointer"
              @click="deleteOne(item._id)"
              class="material-symbols-outlined none"
            >
              close
            </span>
          </p>
        </div>
        <button @click="deleteAll()" class="clearNotification">Xóa Thông Báo</button>
      </div>

      <div
        class="d-flex align-content-center mr-3 my-1 cursor-pointer"
        @click="toggleDropdown"
      >
        <img
          class="rounded-circle cursor-pointer"
          :src="getAvatarUrl(data.employeeName)"
          alt="Avatar"
        />
        <div
          class="d-xl-flex color-dark d-none flex-column align-items-center justify-content-center ml-2"
        >
          <span class="size-14">{{ employeeName }}</span>
          <span class="size-14">{{ roleName }}</span>
        </div>
      </div>
    </div>
  </nav>
  <div v-if="showDropdown" class="logout">
    <span @click="logout" class="btnlogout">
      <i class="fas fa-sign-out-alt" style="font-size: 20px"></i>
      <span class="logout-text">Đăng Xuất</span>
    </span>
  </div>
</template>

<style scoped>
/* .modal{
  position: absolute;
  opacity: 1;
  z-index: 9999;
} */
.logout {
  position: absolute;
  top: 68px;
  right: 0;
  width: 200px;
  height: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  /* padding: 15px; */
  padding: auto;
  margin-right: 14px;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btnlogout {
  color: var(--dark);
  /* margin-left: 30px; */
  margin: auto;
  cursor: pointer;
  font-size: 16px;
}
.btnlogout:hover {
  color: darkred;
  text-decoration: underline;
}
.logout-text {
  margin-left: 10px;
}
.material-symbols-outlined {
  font-variation-settings: "FILL" 1, "wght" 300, "GRAD" 0, "opsz" 48;
}

h6 {
  border-bottom: 1px solid #ccc;
  height: 50px;
  padding-top: 10px;
  color: black;
}
.NoticeDetails {
  height: auto;
  padding: 5px;
  margin: 0;
  cursor: pointer;
  flex-basis: 350px;
  color: black;
}
.line {
  border-bottom: 1px solid rgb(216, 217, 218);
}
.none {
  display: none;
}
.line:hover .none {
  display: block;
}
.line:hover {
  background-color: aliceblue;
}
.notify-icon {
  position: relative;
}
.notification-dropdown {
  position: absolute;
  top: 68px;
  right: 0;
  width: 400px;
  max-height: calc(85vh - 120px); /* Adjust this value as needed */
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-right: 14px;
  z-index: 99999;
  /* display: grid;
  grid-template-columns: 250px 100px;
  grid-gap: 10px; */
}
.notification-dropdown::before {
  content: "";
  position: absolute;
  top: -10px;
  left: calc(50% - 18px);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}
.markAllAsRead {
  border: 1px solid rgb(188, 229, 255);
  border-radius: 8px;
  background-color: rgb(188, 229, 255);
  font-size: 12px;
  padding: 5px;
  color: rgb(69, 69, 246);
  font-weight: bold;
}
.markUnread {
  border: 1px solid rgb(188, 229, 255);
  border-radius: 8px;
  /* background-color:  rgb(188, 229, 255); */
  font-size: 12px;
  padding: 5px;
  color: rgb(69, 69, 246);
  font-weight: bold;
}
.color-dark {
  color: var(--dark);
}
.border-nav {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.avatar {
  width: 50px;
  height: 50px;
}
.italic-text {
  font-style: italic;
}
.cursor-pointer {
  cursor: pointer;
}
.font-size-13 {
  font-size: 13px;
}
.notification-icon {
  position: relative;
}
.notification-dot {
  position: absolute;
  top: 37%;
  left: 60%;
  transform: translate(-50%, -50%);
  width: 17px;
  height: 17px;
  background-color: var(--red);
  border-radius: 50%;
  display: inline-block;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 17px;
  margin-left: 5px;
  cursor: pointer;
}
.clearNotification {
  position: sticky;
  bottom: 10px; /* Adjust this value as needed */
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  padding: 10px; /* Add padding for better visibility */
  font-weight: bold;
}
.clearNotification::after {
  content: "";
  position: absolute;
  top: 128%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, 1);
  backdrop-filter: blur(10px);
}
</style>
