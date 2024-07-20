<template>
  <div class="main-body">
    <div class="header">
      <div class="section-logo">
        <img src="../assets/white-logo.png" alt="logo" />
        <div class="title-logo">برنامه اساتید دانشگاه قم</div>
      </div>
    </div>
    <div class="page-search">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="نام استاد را وارد کنید..."
        />
        <div class="select-box">
          <select v-model="groupSearch">
            <option disabled value="">گروه را انتخاب کنید</option>
            <option v-for="group in groups" @change="searchGroup" :key="group">
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
      currentPage: 1,
      itemsPerPage: 10,
      filteredProfessors: [],
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
  },
  methods: {
    searchGroup() {
      console.log("object");
      this.filteredProfessors = this.professors.filter((item) =>
        item.group.includes(this.groupSearch)
      );
    },
    closeSearch() {
      this.searchQuery = "";
      this.filteredProfessors = this.professors;
    },
    search() {
      if (this.searchQuery.includes("ی"))
        this.searchQuery = this.searchQuery.replace("ی", "ي");
      if (this.groupSearch)
        this.filteredProfessors = this.professors.filter(
          (professor) =>
            professor.name.includes(this.searchQuery) &&
            professor.group.includes(this.groupSearch)
        );
      else
        this.filteredProfessors = this.professors.filter((professor) =>
          professor.name.includes(this.searchQuery)
        );
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
  margin-bottom: -85px;
  width: 100%;
  background-position: center bottom;
  background-size: cover;
  background-image: url(/src/assets/header-back.jpg);
  color: white;
  padding: 16px;
  text-align: center;
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
