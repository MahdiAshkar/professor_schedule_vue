<template>
  <div class="main-body">
    <div class="header">
      <div class="section-logo">
        <img src="../assets/white-logo.png" alt="logo" />
        <div class="title-logo">برنامه اساتید دانشگاه قم</div>
        <div v-if="!student" class="login">
          <button @click="toLogin">ورود</button>
        </div>
        <div v-else class="account">
          <button @click="toAccount">پروفایل کاربری</button>
          <button
            disabled
            style="
              background-color: mediumblue;
              color: white;
              margin-left: 15px;
              cursor: default;
            "
          >
            {{ student.name }}
          </button>
        </div>
      </div>
    </div>
    <div class="page-search">
      <div class="search-box">
        <input
          v-on:keyup.enter="search"
          type="text"
          v-model="searchQuery"
          placeholder="نام استاد را وارد کنید..."
        />
        <div class="select-box">
          <select v-model="groupSearch" @click="search">
            <option value="">گروه را انتخاب کنید</option>
            <option v-for="group in groups" :key="group">
              {{ group }}
            </option>
          </select>
        </div>
        <span class="close fa fa-close" @click="closeSearch"></span>
        <span class="search fa fa-search" @click="search"></span>
      </div>
      <div v-if="filteredProfessors.length > 0" class="professor-list">
        <Card
          v-for="professor in paginatedProfessors"
          :key="professor.id"
          :professor="professor"
          :student="student"
        />
      </div>
      <div v-else class="not-found">چیزی پیدا نشد!</div>
      <Paginator
        :rows="itemsPerPage"
        :totalRecords="filteredProfessors.length"
        :first="first"
        @page="onPageChange"
      ></Paginator>
    </div>
  </div>
</template>

<script>
import Card from "@/components/Card.vue";
import getCookie from "@/utils/function";
import axios from "axios";
import Paginator from "primevue/paginator";
export default {
  components: {
    Card,
    Paginator,
  },
  data() {
    return {
      searchQuery: "",
      professors: [],
      student: null,
      currentPage: 1,
      itemsPerPage: 10,
      filteredProfessors: [],
      baseURl: "http://localhost:3000",
      groups: [
        "آمار",
        "اخلاق",
        "اقتصاد اسلامي",
        "تربيت  بدني",
        "حسابداري",
        "حقوق  جزا و جرم  شناسي",
        "حقوق  خصوصي",
        "حقوق بين الملل",
        "حقوق عمومي",
        "حقوق مالكيت فكري",
        "رياضي",
        "زبان  و ادبيات  انگليسي",
        "زبان  و ادبيات  عربي",
        "زبان  و ادبيات  فارسي",
        "زيست شناسي",
        "شيعه شناسي",
        "شيمي",
        "علم اطلاعات و دانش شناسي",
        "علوم  تربيتي",
        "علوم قرآن و حديث",
        "علوم كامپيوتر",
        "فقه  و مباني  حقوق  اسلامي",
        "فلسفه  و كلام  اسلامي",
        "فيزيك",
        "مديريت بازرگاني",
        "مديريت صنعتي",
        "معارف",
        "معماري",
        "مهندسي  صنايع",
        "مهندسي برق",
        "مهندسي شيمي",
        "مهندسي عمران",
        "مهندسي كامپيوتر",
        "مهندسي مكانيك",
      ],
      groupSearch: "",
      first: 0,
      id: null,
    };
  },
  computed: {
    paginatedProfessors() {
      const start = this.first;
      const end = start + this.itemsPerPage;
      return this.filteredProfessors.slice(start, end);
    },
  },
  mounted() {
    this.getAllProfessors();
    this.isAccount();
  },
  methods: {
    closeSearch() {
      this.searchQuery = "";
      this.filteredProfessors = this.professors;
      this.groupSearch = "";
    },
    async isAccount() {
      const s_token = getCookie("student_token");
      if (s_token) {
        try {
          const res = await axios.get(
            `${this.baseURl}/s/checkToken/${s_token}`,
            {
              withCredentials: true,
            }
          );
          if (res.status == 200) {
            this.student = res.data;
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    toAccount() {
      this.$router.push({
        name: "DashboardStudentPage",
        params: { id: this.student._id },
      });
    },
    toLogin() {
      this.$router.push({ name: "StudentLoginPage" });
    },
    async search() {
      if (this.searchQuery.includes("ی"))
        this.searchQuery = this.searchQuery.replace("ی", "ي");
      try {
        if (this.groupSearch) {
          const response = await axios.get(
            `http://localhost:3000/professor/search?query=${this.searchQuery}&group=${this.groupSearch}`
          );
          this.filteredProfessors = response.data;
        } else {
          const response = await axios.get(
            `http://localhost:3000/professor/search?query=${this.searchQuery}`
          );
          this.filteredProfessors = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getAllProfessors() {
      try {
        const response = await axios.get("http://localhost:3000/professor/all");
        this.professors = response.data;
        this.filteredProfessors = this.professors;
      } catch (error) {
        console.error(error);
      }
    },
    onPageChange(event) {
      this.first = event.first;
      this.itemsPerPage = event.rows;
      this.currentPage = event.page + 1;
    },
  },
};
</script>

<style scoped>
.select-box select {
  border: 1px solid black;
  border-radius: 20px;
  padding: 0.5rem;
  min-width: 100px;
  height: 50px;
}

.select-box select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
.select-box {
  border-radius: 20px;
  margin-top: 1.5%;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
}
.not-found {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5%;
}
.professor-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2%;
  margin-bottom: 1%;
}
.search-box {
  margin: 10px 5%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
}
input[text]:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
.section-logo {
  display: flex;
  flex-direction: row;
  justify-content: start;
  justify-items: start;
}
.main-body {
  background-color: #ccc;
}

.page-search {
  background-color: white;
  margin: 0 5%;
  min-width: 50%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 180px;
  margin-bottom: -60px;
  width: 100%;
  background-position: center bottom;
  background-size: cover;
  background-image: url(/src/assets/header-back.jpg);
  color: white;
  padding: 16px;
  text-align: center;
}
button {
  background: #fff;
  color: #007bff;
  font-size: 22px;
  border: 5px;
  border-color: #007bff;
  border-radius: 10px;
  cursor: pointer;
  padding: 2px 20px 5px;
  transition: background 0.3s ease;
}
.login {
  margin-right: 60%;
  margin-top: 1%;
  margin-bottom: 1%;
}
.account {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  margin-right: 50%;

  margin-top: 0.5%;
}
.account button {
  height: 50px;
  margin-top: 15px;
  background-color: none;
  color: #000000;
  font-size: 15px;
  border: none;
  border-color: #007bff;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.account img {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin-left: 15px;
}
input {
  margin-top: 16px;
  padding: 8px;
  width: 50%;
  border-radius: 20px;
}

h1 {
  font-family: "Vazir";
}
.title-logo {
  font-family: "Vazir";
  color: white;
  font-size: 28px;
  margin-right: 10px;
}
.search {
  background-color: #28a745;
  color: white;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  padding: 5px;
  font-size: 28px;
  margin-top: 1.5%;
}
.search:hover {
  background-color: #03691b;
}
.close {
  background-color: #e01f32;
  color: white;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  padding: 6px;
  font-size: 28px;
  margin-top: 1.5%;
  margin-left: 0.5%;
  margin-right: 0.8%;
}
.close:hover {
  background-color: #e9081e;
}
</style>
