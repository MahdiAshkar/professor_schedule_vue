<template>
  <header
    class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow"
    data-bs-theme="dark"
  >
    <ul class="navbar-nav flex-row d-md-none">
      <li class="nav-item text-nowrap">
        <button
          class="nav-link px-2 fa fa-list"
          type="button"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        ></button>
      </li>
    </ul>
  </header>

  <div class="container-fluid main">
    <div class="row">
      <div class="sidebar border border-right col-md-3 col-lg-2 p-2 pb-lg-5">
        <div
          class="bg-body-tertiary"
          tabindex="-1"
          id="sidebarMenu"
          aria-labelledby="sidebarMenuLabel"
        >
          <div class="d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
            <div class="image-container">
              <img :src="getSourcePhoto()" alt="profile" />
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a
                  @click="home()"
                  class="nav-link nav-link d-flex gap-5 fa fa-home"
                  href="#"
                >
                  <p class="pl-2">صفحه اصلی</p>
                </a>
              </li>
              <li class="nav-item" :class="{ active: showAccount }">
                <a
                  @click="ShowAccount()"
                  class="nav-link d-flex gap-5 fa fa-user"
                  href="#"
                  ><p class="pl-2">حساب کاربری</p>
                </a>
              </li>
              <li class="nav-item" :class="{ active: showProgram }">
                <a
                  @click="ShowProgram()"
                  class="nav-link d-flex gap-5 fa fa-calendar"
                  href="#"
                >
                  <p class="pl-2">برنامه</p>
                </a>
              </li>
              <li class="nav-item" :class="{ active: showChat }">
                <a
                  @click="ShowChat()"
                  class="nav-link d-flex gap-5 fa fa-comment"
                  href="#"
                >
                  <p class="pl-2">پیام ها</p>
                </a>
              </li>
              <li class="nav-item">
                <a
                  @click="exit()"
                  class="nav-link nav-link d-flex gap-5 fa fa-sign-out"
                  href="#"
                >
                  <p class="pl-2">خروج</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <main v-if="showProgram" class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div
          class="d-flex justify-content-start flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
        >
          <img src="logo_qom.ico" alt="logo Qom" width="50px" height="50px" />

          <h1 class="h2 ml-4">{{ name }}</h1>
        </div>
        <scheduleTable :show="false" :id="id"></scheduleTable>
      </main>
      <main v-else-if="showChat" class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <TableChatHistory :data="data"></TableChatHistory>
      </main>
      <main v-else class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <changeAccountPage
          :data="data"
          :studentNumber="studentNumber"
        ></changeAccountPage>
      </main>
    </div>
  </div>
</template>

<script>
import scheduleTable from "@/components/ScheduleTable.vue";
import changeAccountPage from "./changeAccountPage.vue";
import axios from "axios";
import ChatPage from "./chatPage.vue";
import TableChatHistory from "./tableChatHistory.vue";
import Cookies from "js-cookie";
export default {
  components: { scheduleTable, changeAccountPage, ChatPage, TableChatHistory },
  data() {
    return {
      showProgram: true,
      showAccount: false,
      showChat: false,
      name: "",
      baseURl: "https://schedule-professor.liara.run",
      data: {},
      id: this.$route.params.id,
      studentNumber: "",
    };
  },
  async mounted() {
    try {
      const res = await axios.get(
        `https://schedule-professor.liara.run/professor/${this.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      this.data = res.data;
      this.name = res.data.name;
      this.studentNumber = res.data.studentNumber;
      if (res.statusText == "OK") {
        console.log("success get info professor in dashboard");
      } else throw new Error("failed request get info professor dashboard");
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    getSourcePhoto() {
      return this.baseURl + this.data.image_profile;
    },
    home() {
      this.$router.push("/home");
    },
    async exit() {
      try {
        let res = await axios.get(
          "https://schedule-professor.liara.run/professor/logout",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.status !== 200) {
          console.log("Failed to log out");
        }
        Cookies.remove("access_token");
        this.$router.push("/login");
      } catch (error) {
        console.log(error);
      }
    },
    ShowAccount() {
      this.showAccount = true;
      this.showProgram = false;
      this.showChat = false;
    },
    ShowProgram() {
      this.showAccount = false;
      this.showProgram = true;
      this.showChat = false;
    },
    ShowChat() {
      this.showAccount = false;
      this.showProgram = false;
      this.showChat = true;
    },
  },
};
</script>

<style scoped>
.image-container {
  position: relative;
  width: 145px;
  height: 145px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 10px solid #00256e;
  margin-left: 20%;
  margin-right: 20%;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 50%;
}

.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
h1 {
  font-family: "Vazir";
}
.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
}
.nav-item:hover,
.active {
  background-color: black;
  border-radius: 15px;
  width: 80%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
}
.nav-item {
  margin-top: 10px;
}
.fa {
  color: white;
  font-size: 12px;
}
.nav-item a {
  padding: 20px 5px 0px 5px;
}
@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

.b-example-divider {
  width: 100%;
  height: 3rem;
  background-color: rgba(255, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow: inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.b-example-vr {
  flex-shrink: 0;
  width: 1.5rem;
  height: 100vh;
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.nav-scroller {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  overflow-y: hidden;
}

.nav-scroller .nav {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  text-align: center;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
p {
  font-family: "Vazir";
  color: white;
  font-size: large;
}

.sidebar {
  min-height: 100vh;
  max-width: 400px;
  background-color: #001c55;
  /* papayawhip; */
  margin: auto;
}
.btn-bd-primary {
  --bd-violet-bg: #712cf9;
  --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

  --bs-btn-font-weight: 600;
  --bs-btn-color: var(--bs-white);
  --bs-btn-bg: var(--bd-violet-bg);
  --bs-btn-border-color: var(--bd-violet-bg);
  --bs-btn-hover-color: var(--bs-white);
  --bs-btn-hover-bg: #6528e0;
  --bs-btn-hover-border-color: #6528e0;
  --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
  --bs-btn-active-color: var(--bs-btn-hover-color);
  --bs-btn-active-bg: #5a23c8;
  --bs-btn-active-border-color: #5a23c8;
}

.bd-mode-toggle {
  z-index: 1500;
}

.bd-mode-toggle .dropdown-menu .active .bi {
  display: block !important;
}
</style>