<!-- src/components/ProfessorCard.vue -->
<template>
  <Toast ref="toast" />
  <div class="card">
    <img :src="getSourcePhoto()" alt="Professor" />
    <div class="card-content">
      <div class="content tilte border-bottom">{{ professor.name }}</div>
      <div class="content">{{ professor.rank }}</div>
      <div class="content group">گروه {{ professor.group }}</div>
      <div class="my-btn">
        <button @click="goToDetails">نمایش برنامه</button>
        <button @click="sendMessage">ارسال پیام</button>
      </div>
    </div>
  </div>
</template>
  
  <script>
import axios from "axios";

export default {
  props: {
    professor: Object,
    student: Object,
  },
  data() {
    return {
      baseURl: "https://schedule-professor.liara.run",
    };
  },
  methods: {
    goToDetails() {
      this.$router.push({
        name: "ProfessorPage",
        params: { id: this.professor._id },
      });
    },
    async sendMessage() {
      if (!this.student) {
        this.$refs.toast.add({
          severity: "error",
          summary: "عدم شناسایی کاربر",
          detail: "  دانشجو محترم ابتدا وارد حساب کاربری خود شوید!",
          life: 2500,
        });
        return;
      }
      this.$router.push({
        name: "chatPage",
        params: {
          professorId: this.professor._id,
          studentId: this.student._id,
          senderName: this.professor.name,
          imageProfessor: this.professor.image_profile,
          imageStudent: this.student.image,
          isStudent: true,
        },
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
  margin: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: box-shadow 0.3s ease;
  width: 320px;
  height: 135px;
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
button {
  background: #007bff;
  color: #fff;
  font-size: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: background 0.3s ease;
}
.my-btn {
  display: flex;
  flex-direction: row;
}
</style>
  


  