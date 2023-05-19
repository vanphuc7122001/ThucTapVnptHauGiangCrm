<script>
import { reactive, ref, defineEmits, defineProps } from "vue";

export default {
  props: {
    activeIndex: {
      type: Number,
      default: 1,
    },
    activeIndexChild: {
      type: Number,
      default: -1,
    },
  },
  setup(props) {
    const data = reactive({
      sidebarToggle: true,
      sidebarTasks: [
        {
          id: 1,
          icon: "dashboard_customize",
          name: "Dashboard",
          role: [],
          children: [],
        },
        {
          id: 2,
          icon: "connect_without_contact",
          name: "Customer",
          role: [],
          children: [],
        },
        {
          id: 3,
          icon: "sprint",
          name: "Activity",
          role: [],
          children: [],
        },
        {
          id: 4,
          icon: "badge",
          name: "Employee",
          role: [],
          children: [],
        },
        {
          id: 5,
          icon: "apartment",
          name: "Unit",
          role: [],
          children: [],
        },
        {
          id: 6,
          icon: "assignment",
          name: "Assignment",
          role: [],
          children: [],
        },
        {
          id: 7,
          icon: "acute",
          name: "Appointment",
          role: [],
          children: [],
        },
        {
          id: 8,
          icon: "account_circle",
          name: "Account",
          role: [],
          children: [],
        },
        {
          id: 9,
          icon: "report",
          name: "Report",
          role: [],
          children: [],
        },
        {
          id: 10,
          icon: "settings",
          name: "Setting",
          role: [],
          children: [],
        },
      ],
    });
    return {
      data,
    };
  },
};
</script>

<template>
  <div class="border-sidebar">
    <div class="d-flex flex-column">
      <div id="img-logo" class="d-flex justify-content-center">
        <img class="img border-img" src="../../assets/images/logo.png" alt="" />
      </div>
      <div class="mt-3">
        <div
          v-for="(sidebarTask, index) in data.sidebarTasks"
          :key="sidebarTask.id"
          class="d-flex flex-column align-items-center"
        >
          <router-link
            :to="{ name: sidebarTask.name }"
            class="my-2 d-flex overflow-hidden"
            :class="[
              sidebarTask.id == activeIndex
                ? 'border-nav-item'
                : 'none-border-nav-item',
            ]"
            @click="activeIndex = index + 1"
          >
            <div class="d-flex py-1 align-items-center">
              <span
                class="material-symbols-outlined mx-2 py-1 px-1"
                :class="[
                  sidebarTask.id == activeIndex
                    ? 'none-border-icon'
                    : 'border-icon',
                ]"
              >
                {{ sidebarTask.icon }}
              </span>
              <span class="d-flex align-items-center" style="font-size: 15px;">{{
                sidebarTask.name
              }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-sidebar {
  border: 1px solid var(--gray);
  border-bottom: 0;
  border-top: 0;
  border-left: 0;
  height: 100vh;
  max-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: auto;
  overflow-y: hidden;
}
.img {
  width: 250px;
}
.border-img {
  border: 1px solid var(--gray);
  border-top: 0;
  border-left: 0;
  border-right: 0;
}
.border-nav-item {
  border: 1px solid var(--gray);
  width: 90%;
  cursor: pointer;
  border-radius: 5px;
}
.none-border-nav-item {
  width: 90%;
  cursor: pointer;
  border: none;
}

.border-icon {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.none-border-icon {
  border: none;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
  display: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(234 179 8);
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}
</style>
