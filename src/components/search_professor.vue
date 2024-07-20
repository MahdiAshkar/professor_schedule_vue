<template>
  <div>
    <h2>Search Professor Schedule</h2>
    <input v-model="name" placeholder="Enter professor username" />
    <button @click="searchProfessor">Search</button>
    <ScheduleTable
      v-if="professor"
      :professor="professor"
      :schedules="schedules"
    />
  </div>
</template>
  
  <script>
import axios from "axios";
import ScheduleTable from "./ScheduleTable.vue";

export default {
  data() {
    return {
      name: "",
      professor: null,
      schedules: [],
    };
  },
  components: {
    ScheduleTable,
  },
  methods: {
    async searchProfessor() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/professors/search`,
          {
            params: { name: this.name },
          }
        );
        this.professor = response.data.professor;
        this.schedules = response.data.schedules;
      } catch (error) {
        console.error(error);
        this.professor = null;
        this.schedules = [];
      }
    },
  },
};
</script>
  
  <style scoped>
input {
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #5cb85c;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #4cae4c;
}
</style>
  