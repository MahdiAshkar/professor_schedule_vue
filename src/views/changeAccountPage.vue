<template>
  <div class="container">
    <Toast ref="toast" position="top-left" />
    <form @submit.prevent="updateProfessor">
      <div class="form-group">
        <label for="photo">عکس پروفایل:</label>
        <input type="file" @change="onFileChange" />
      </div>

      <div class="form-group-row">
        <div class="form-group">
          <label for="name">نام و نام خانوادگی:</label>
          <input type="text" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="username">نام کاربری:</label>
          <input type="text" v-model="username" required />
        </div>
      </div>
      <div class="form-group-row">
        <div class="form-group">
          <label for="group">گروه:</label>
          <select v-model="groupName" required>
            <option v-for="group in groups" :key="group">{{ group }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="rank">مرتبه علمی:</label>
          <select v-model="rank" required>
            <option v-for="rank in ranks" :key="rank">{{ rank }}</option>
          </select>
        </div>
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
      <div class="form-group-row">
        <div class="form-group">
          <label for="phone">شماره تلفن :</label>
          <input type="text" v-model="phone_office" />
        </div>
        <div class="form-group">
          <label for="email">ایمیل:</label>
          <input type="email" v-model="email" required />
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
    this.username = this.data.username || "";
    this.newEmail = this.data.email || "";
    this.email = this.data.email || "";
    this.phone_office = this.data.phone_office || "";
    this.rank = this.data.rank || "";
    this.groupName = this.data.group || "";
  },

  data() {
    return {
      name: "",
      username: "",
      password: "",
      rank: "",
      groupName: "",
      phone_office: "",
      photo: "",
      confirmPassword: "",
      email: "",
      newEmail: "",
      groups: [
        " آمار",
        " تربيت بدني",
        " حقوق جزا و جرم شناسي",
        " شيمي",
        " مهندسي عمران",
        " حسابداري",
        " علوم قرآن و حديث",
        "مهندسي شيمي",
        " شيعه شناسي",
        " حقوق مالكيت فكري",
        "زبان و ادبيات عربي",
        " فقه و مباني حقوق اسلامي",
        " زيست شناسي",
        " مديريت بازرگاني",
        " معماري",
        " فلسفه و كلام اسلامي",
        " زبان و ادبيات فارسي",
        " مهندسي برق",
        " علوم تربيتي",
        " مهندسي شيمي",
        " زبان و ادبيات انگليسي",
        " فيزيك",
        " رياضي",
        " حقوق بين الملل",
        " علم اطلاعات و دانش شناسي",
        " مهندسي مكانيك",
        " مهندسي صنايع",
        " زبان و ادبيات عربي",
        " حقوق عمومي",
        " حقوق خصوصي",
        " علوم كامپيوتر",
        " مهندسي كامپيوتر",
        " معارف",
        " اقتصاد اسلامي",
        " اخلاق",
      ],
      ranks: ["استاد تمام", "دانشيار", "استادیار", "مربی"],
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
      formData.append("newName", this.name);
      formData.append("newUsername", this.username);
      formData.append("newPassword", this.password);
      formData.append("newEmail", this.newEmail);
      formData.append("newRank", this.rank);
      formData.append("newGroup", this.groupName);
      formData.append("newPhoneOffice", this.phone_office);
      formData.append("email", this.email);
      formData.append("newPhoto", this.photo);

      try {
        const response = await axios.put(
          "http://localhost:3000/professor/update",
          formData,
          { withCredentials: true }
        );

        if (response.status == 200) {
          this.$refs.toast.add({
            severity: "success",
            summary: "تایید ایمیل",
            detail: "برای تایید  تغییرات به ایمیل اولیه تان مراجعه کنید ",
            life: 6000,
          });
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
  