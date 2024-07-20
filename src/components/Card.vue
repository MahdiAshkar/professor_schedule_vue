<!-- src/components/ProfessorCard.vue -->
<template>
  <div class="card" @click="goToDetails">
    <img :src="getSourcePhoto()" alt="Professor" />
    <div class="card-content">
      <div class="content tilte border-bottom">{{ professor.name }}</div>
      <div class="content">{{ professor.rank }}</div>
      <div class="content group">گروه {{ professor.group }}</div>
    </div>
  </div>
</template>
  
  <script>
export default {
  props: {
    professor: Object,
  },
  data() {
    return {
      baseURl: "http://localhost:3000",
    };
  },
  methods: {
    goToDetails() {
      this.$router.push({
        name: "ProfessorPage",
        params: { id: this.professor._id },
      });
    },
    getSourcePhoto() {
      return this.baseURl + this.professor.image_profile;
    },
  },
};
</script>
  
  <style scoped>
.content {
  font-size: 15px;
  font-family: "Vazir";
  display: inline-flex;
}
.tilte {
  font-weight: bold;
}
.group {
  font-size: 13px;
}
.card {
  border: 1px solid #ccc;
  margin: 13px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: box-shadow 0.3s ease;
  width: 320px;
  height: 125px;
  border-radius: 15px;
  padding: 20px;
}
.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ccc;
}
img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-left: 15px;
}
.card-content {
  flex: 1;
  flex-direction: column;
  display: flex;
  justify-content: center;
}
.fa {
  font-size: 20px;
  margin-right: 5px;
  margin-top: 1px;
}
</style>
  


  