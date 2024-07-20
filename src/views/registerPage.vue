<template>
  <div class="container">
    <Toast ref="toast" />
    <form @submit.prevent="registerProfessor">
      <div class="form-group">
        <div v-if="avatarPreview" class="circular--square">
          <img :src="avatarPreview" />
        </div>
        <label for="photo">عکس پروفایل:</label>
        <input type="file" @change="onFileChange" />
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="name">نام و نام خانوادگی:*</label>
          <input type="text" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="username">نام کاربری:*</label>
          <input type="text" v-model="username" required />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="group">گروه:*</label>
          <select v-model="group" required>
            <option v-for="group in groups" :key="group">{{ group }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="rank">مرتبه علمی:*</label>
          <select v-model="rank" required>
            <option v-for="rank in ranks" :key="rank">{{ rank }}</option>
          </select>
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="password">رمز:*</label>
          <input type="password" v-model="password" required />
        </div>
        <div class="form-group">
          <div class="form-group">
            <label for="confirmPassword">تایید رمز:*</label>
            <input type="password" v-model="confirmPassword" required />
          </div>
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="phone">شماره تلفن :</label>
          <input type="text" v-model="phone_office" />
        </div>
        <div class="form-group">
          <label for="email">ایمیل:*</label>
          <input type="email" v-model="email" required />
        </div>
      </div>

      <button type="submit">ثبت نام</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      username: "",
      password: "",
      photo: null,
      confirmPassword: "",
      phone_office: null,
      email: "",
      avatarPreview: null,
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
      group: "",
      ranks: ["استاد تمام", "دانشيار", "استادیار", "مربی"],
      rank: "",
    };
  },
  methods: {
    onFileChange(e) {
      this.photo = e.target.files[0];
      if (this.photo) this.avatarPreview = URL.createObjectURL(this.photo);
      else this.avatarPreview = null;
    },
    async registerProfessor() {
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
      formData.append("username", this.username);
      formData.append("password", this.password);
      formData.append("email", this.email);
      formData.append("photo", this.photo);
      formData.append("group", this.group);
      formData.append("rank", this.rank);

      try {
        const response = await axios.post(
          "http://localhost:3000/professor/register",
          formData
        );
        console.log(response);
        if (response.status == 201) {
          this.$refs.toast.add({
            severity: "success",
            summary: "موفقیت آمیز",
            detail: "ثبت نام انجام شد",
            life: 1000,
          });
          setTimeout(() => {
            this.$router.push({
              name: "LoginPage",
            });
          }, 1000);
        } else
          throw new Error(response?.message || "register failed Professor");
      } catch (err) {
        this.$refs.toast.add({
          severity: "error",
          summary: "خطا",
          detail: err.response.data?.message || err.message,
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
.container {
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: auto;
  margin-top: 2%;
  background-color: #001c55;
}

.form-group-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.form-group {
  flex: 1;
  min-width: 48%;
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.2rem;
  font-weight: bold;
  color: white;
  direction: rtl;
}

input[type="text"],
input[type="password"],
input[type="file"],
input[type="email"],
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
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
