   <template>
  <div class="main">
    <div class="row">
      <div class="sidebar border border-right col-md-3 col-lg-2 p-2 pb-lg-5">
        <div class="bg-body-tertiary" tabindex="-1">
          <div class="d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
            <div class="image-container">
              <img :src="getSourcePhoto()" alt="profile" />
            </div>
            <ul class="nav flex-column">
              <li class="nav-home" @click="home">
                <p class="pl-2">صفحه اصلی</p>
              </li>

              <li class="nav-item">
                <label for="email">ایمیل</label>
                <p>{{ email }}</p>
              </li>
              <li class="nav-item">
                <label for="phone_office">شماره دفتر</label>
                <p>{{ phone_office }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-4 mr-4 ml-5 col-md-5 ms-sm-auto col-lg-8 px-md-2">
        <div
          class="d-flex justify-content-start flex-wrap flex-md-nowrap align-items-center pb-2 mb-2 border-bottom"
        >
          <img
            src="../assets/logo_qom.png"
            alt="logo Qom"
            width="50px"
            height="50px"
          />
          <h1 class="h2 ml-4">برنامه استاد {{ this.name }}</h1>
        </div>
        <main>
          <scheduleTable :show="true" :id="id"></scheduleTable>
        </main>
      </div>
    </div>
  </div>
</template>
  
  <script>
import scheduleTable from "@/components/ScheduleTable.vue";
import axios from "axios";
export default {
  components: { scheduleTable },
  data() {
    return {
      name: "",
      email: "",
      phone_office: "",
      baseURl: "http://localhost:3000",
      data: {},
      id: this.$route.params.id,
    };
  },
  async mounted() {
    try {
      const res = await axios.get(`http://localhost:3000/professor/${this.id}`);
      this.data = res.data;
      this.name = res.data.name;
      this.email = res.data.email;
      this.phone_office = res.data.phone_office;
      if (res.statusText == "OK") {
      } else throw new Error("failed request ");
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
.nav-home:hover {
  background-color: black;
  border-radius: 15px;
  width: 80%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
  padding-top: 10px;
}
.nav-item {
  margin-top: 10px;
}
.nav-item label {
  color: white;
}
.fa {
  color: white;
  font-size: 10px;
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
  max-width: 300px;
  background-color: #001c55;
  /* papayawhip; */
  /* margin: auto; */
  margin-right: 15px;
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