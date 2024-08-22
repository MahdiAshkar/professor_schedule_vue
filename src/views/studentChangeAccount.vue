<template>
  <div class="container">
    <Toast ref="toast" position="top-left" />
    <form @submit.prevent="updateProfessor">
      <div class="form-group">
        <label for="photo">عکس پروفایل:</label>
        <input type="file" @change="onFileChange" />
      </div>

      <div class="form-group">
        <label for="name">نام و نام خانوادگی:</label>
        <input type="text" v-model="name" required />
      </div>

      <div class="form-group-row">
        <div class="form-group">
          <label for="password">رمز:</label>
          <input type="password" v-model="password" required />
        </div>
        <div class="form-group">
          <div class="form-group">
            <label for="confirmPassword">تایید رمز:</label>
            <input type="password" v-model="confirmPassword" required />
          </div>
        </div>
      </div>

      <button type="submit">ویرایش</button>
    </form>
  </div>
</template>
    
    <script>
import axios from "axios";

export default {
  props: ["data"],
  async mounted() {
    this.name = this.data.name || "";
    this.studentNumber = this.data.studentNumber || "";
  },

  data() {
    return {
      name: "",
      password: "",
      studentNumber: "",
      photo: "",
      confirmPassword: "",
    };
  },
  methods: {
    onFileChange(e) {
      this.photo = e.target.files[0];
    },
    async updateProfessor() {
      if (this.password !== this.confirmPassword) {
        this.$refs.toast.add({
          severity: "error",
          summary: "خطا",
          detail: "پسورد ها یکسان نمی باشد",
          life: 3000,
        });
        return;
      }
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("password", this.password);
      formData.append("studentNumber", this.studentNumber);
      formData.append("image", this.photo);

      try {
        const response = await axios.put(
          "http://localhost:3000/s/update",
          formData,
          { withCredentials: true }
        );

        if (response.status == 200) {
          this.$refs.toast.add({
            severity: "success",
            summary: "اطلاعات تغییر یافت ",
            detail: "موفقت آمیز بود",
            life: 2000,
          });

          location.reload();
        } else
          throw new Error(
            response?.message || " تغییرات اعمال نشد مشکل در ارسال "
          );
      } catch (err) {
        this.$refs.toast.add({
          severity: "error",
          summary: "خطا",
          detail: err || err.message,
        });
      }
    },
  },
};
</script>
    <style scoped>
.circular--square img {
  border-radius: 70%;
  width: 140px;
  height: 140px;
  border: 1px solid black;
  margin-right: 30%;
  margin-left: 30%;
}
.form-group-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}
.container {
  padding: 1rem;
  width: 100%;
  max-width: 50%;
  margin: auto;
  margin-top: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: flex;
  flex-direction: right;
  margin-bottom: 0.2rem;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
select {
  width: 200px;
}
button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}
</style>
    