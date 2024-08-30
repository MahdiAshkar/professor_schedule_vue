<template>
  <Toast ref="toast" />
  <section class="ftco-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-12 col-lg-10">
          <div class="wrap1 d-md-flex">
            <div
              class="wrap1 p-4 p-lg-5 text-center d-flex align-items-center order-md-last"
            >
              <div class="nav-register text1 text w-100">
                <h2>خوش آمدید</h2>
                <p>اگر حساب کاربری ندارید؟</p>
                <router-link
                  class="btn btn-white btn-outline-white register"
                  :to="{ name: 'registerPage' }"
                  >ثبت نام</router-link
                >
              </div>
            </div>
            <div class="login-wrap p-4 p-lg-5">
              <div class="d-flex">
                <div class="w-100">
                  <h3 class="mb-4 text-center">ورود</h3>
                </div>
                <div class="w-100"></div>
              </div>
              <form @submit.prevent="login" class="signin-form">
                <div class="form-group mb-3">
                  <label class="label" for="name">نام کاربری</label>
                  <input
                    v-model="username"
                    type="text"
                    class="form-control"
                    placeholder="نام کاربری"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label class="label" for="password">رمز عبور</label>
                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="رمز عبور"
                    required
                  />
                </div>
                <div class="form-group">
                  <button
                    type="submit "
                    class="form-control1 form-control btn submit px-3"
                  >
                    ورود
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
    
    <script>
export default {
  data() {
    return { username: "", password: "" };
  },
  methods: {
    async login() {
      try {
        const response = await fetch(
          "https://schedule-professor.liara.run/professor/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
            }),
          }
        );
        if (!response.ok) {
          this.$refs.toast.add({
            severity: "error",
            summary: "خطا",
            detail: "نام کاربری یا رمز عبور اشتباه است !",
            life: 2500,
          });
          return;
        }
        const data = await response.json();
        const id = data.id;
        document.cookie = `access_token=${data.token};path=/;`;
        this.$refs.toast.add({
          severity: "success",
          summary: "موفقیت آمیز",
          detail: "با موفقیت وارد شدید",
          life: 1000,
        });

        setTimeout(() => {
          this.$router.push({
            name: "DashboardPage",
            params: { id },
          });
        }, 1000);
      } catch (error) {
        this.$refs.toast.add({
          severity: "error",
          summary: "خطا",
          detail: error,
        });
      }
    },
  },
};
</script>
    
<style scoped>
.nav-register .register {
  color: black;
  background-color: white;
  /* rgb(240, 153, 14); */
}
.nav-register .register:hover {
  background-color: black;
  color: white;
}
.form-control1:hover {
  background-color: black;
  color: white;
}
.ftco-section {
  font-family: "Vazir", sans-serif;
}
.mb-4 {
  font-family: "Vazir", sans-serif;
  text-align: right;
}

.wrap1 {
  background-color: #001c55;
  /* papayawhip; */
  color: white;
}
.text1 {
  margin-right: 100px;
  color: white;
}

p,
h2,
h3,
label {
  font-family: "Vazir";
  color: white;
}
.form-control1 {
  background-color: #001c55;
  /* rgb(240, 153, 14); */
  margin-top: 12px;
  color: white;
}
</style>