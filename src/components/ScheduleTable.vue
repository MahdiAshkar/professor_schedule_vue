
   <template>
  <div>
    <Toast ref="toast" position="top-left" />
    <div class="container">
      <div class="container-row">
        <div v-if="!show" class="top-buttons">
          <button @click="openModal(null)" class="add-button">ایجاد</button>
          <button v-if="showSubmit" @click="saveSchedule" class="save-button">
            تایید نهایی
          </button>
          <button v-else @click="saveSchedule" class="edit-button">
            ویرایش
          </button>
        </div>
        <div :class="{ 'center-term': show, 'term-align': !show }">
          <div :class="{ term: !show }">
            <label for="term">ترم:</label>
            <select v-model="term" @change="fetchDataToApi" id="term">
              <option
                v-for="termOption in termOptions"
                :key="termOption"
                :value="termOptions.indexOf(termOption)"
              >
                {{ termOption }}
              </option>
            </select>
          </div>
          <div>
            <label for="academicYear">سال تحصیلی:</label>
            <select
              v-model="academicYear"
              @change="fetchDataToApi"
              id="academicYear"
            >
              <option v-for="year in academicYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="!show" class="center-paragraph">
          <p>
            مجموع ساعت تعیین شده در هفته ساعت
            <span class="total-duration">{{ durationTotal() }}</span> است
          </p>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="schedule-table">
        <thead>
          <tr>
            <th>روز</th>
            <th v-for="time in times" :key="time">{{ time }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in days" :key="day">
            <td class="day">{{ day }}</td>

            <template v-for="time in times" :key="time">
              <td
                :class="{ scheduled: !show, 'task-added': hasTask(day, time) }"
                v-if="!isMergedCell(day, time)"
                :colspan="getColSpan(day, time)"
                @click="openModal(getSchedule(day, time))"
              >
                <center>
                  <p
                    v-if="hasTask(day, time)"
                    :class="{ 'head-time': hasTask(day, time) }"
                  >
                    {{ getTime(day, time) }}
                  </p>
                  {{ getTask(day, time) }}
                </center>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <modal
      v-if="showModal"
      :tasksDefault="tasksDefault"
      :days="days"
      :times="times"
      :editedSchedule="editedSchedule"
      @close="closeModal"
      @save="saveScheduleEntry"
      @delete="deleteScheduleEntry"
    ></modal>
  </div>
</template>
  
  <script>
import Modal from "./Modal.vue";
import axios from "axios";
import moment from "jalali-moment";
export default {
  components: {
    Modal,
  },
  props: ["id", "show"],
  data() {
    return {
      tasksDefault: [
        "حضور در جلسات",
        "مطالعه پژوهش",
        "راهنمایی پایان نامه ",
        "فعالیت اجرایی",
        "عدم حضور",
      ],
      times: [
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ],
      days: ["شنبه", "یکشنبه", "دو‌شنبه", "سه‌شنبه", "چهار‌شنبه", "پنج‌شنبه"],
      showModal: false,
      schedules: [],
      editedSchedule: null,
      duration: 1,
      showSubmit: true,
      term: null,
      termOptions: ["تابستان", "اول", "دوم"],
      academicYear: null,
      academicYears: [],
      idSchedule: "",
    };
  },
  async mounted() {
    this.getLatestSchedule();
    this.generateAcademicYears();
  },

  methods: {
    async getLatestSchedule() {
      try {
        const res = await axios.get(
          `http://localhost:3000/schedule/latest/${this.id}`
        );
        console.log(res);
        if (res.status == 200) {
          const data = res.data[0];
          let apiSchedules = data.days;
          this.convertApiFormatToVue(apiSchedules);
          this.term = data.term;
          this.academicYear = data.academicYear;
          this.showSubmit = false;
        } else {
          this.$refs.toast.add({
            severity: "info",
            summary: "اطلاعیه",
            detail: "جدولی یافت نشد !!",
            life: 3000,
          });
        }
      } catch (err) {
        this.$refs.toast.add({
          severity: "info",
          summary: "اطلاعیه",
          detail: "جدولی یافت نشد !!",
          life: 3000,
        });
      }
    },
    generateAcademicYears() {
      const startYear = 1400;
      const now = new Date();
      const yearMilady = now.toISOString().split("T")[0];
      const endYears = moment(yearMilady, "YYYY-MM-DD")
        .locale("fa")
        .format("YYYY");
      const numberOfYears = endYears - startYear + 1;
      for (let i = 0; i < numberOfYears; i++) {
        this.academicYears.push(startYear + i);
      }
    },
    async fetchDataToApi() {
      try {
        const idSchedule = await this.getIdSchedule(
          this.id,
          this.term,
          this.academicYear
        );
        if (idSchedule) {
          let res = await axios.get(
            `http://localhost:3000/schedule/${idSchedule}`
          );
          let apiSchedules = res.data.days;
          this.convertApiFormatToVue(apiSchedules);
          this.showSubmit = false;
        } else {
          if (this.show) {
            this.$refs.toast.add({
              severity: "info",
              summary: "اطلاعیه",
              detail: "جدولی یافت نشد !!",
              life: 3000,
            });
          } else {
            this.$refs.toast.add({
              severity: "info",
              summary: "اطلاعیه",
              detail: "در این سال تحصیلی یا ترم جدولی نداریم اضافه کنید !",
              life: 3000,
            });
          }
          this.schedules = [];
          this.showSubmit = true;
        }
      } catch (err) {}
    },

    async getIdSchedule(id, term, acadamicYear) {
      try {
        const res = await axios.get(
          `http://localhost:3000/schedule/${id}/${term}/${acadamicYear}`
        );
        if (res.status == 200) {
          return res.data;
        } else {
          throw new Error("not found id schedule");
        }
      } catch (err) {
        console.log(err);
      }
    },

    convertApiFormatToVue(apiData) {
      const schedulesApi = [];

      apiData.forEach((daySchedule) => {
        daySchedule.timeSlots.forEach((timeSlot) => {
          schedulesApi.push({
            day: daySchedule.day,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            task: timeSlot.task,
            duration: timeSlot.duration,
          });
        });
      });

      this.schedules = schedulesApi;
    },

    durationTotal() {
      let total = 0;
      for (let schedule of this.schedules) {
        total += schedule.duration;
      }
      return total;
    },
    async saveSchedule() {
      let infoSchedule = this.convertToApiFormat();
      const accessToken = getCookie("access_token");
      if (!accessToken) {
        alert("زمان نشست شما تمام شده است دوباره وارد شوید");
        return this.$router.push({ name: "LoginPage" });
      }
      let total = this.durationTotal();
      if (total >= 2) {
        try {
          if (this.showSubmit) {
            var response = await axios.post(
              "http://localhost:3000/professor/create-schedule",
              infoSchedule,
              {
                withCredentials: true,
              }
            );
            if (response.status == 201) {
              this.$refs.toast.add({
                severity: "success",
                summary: "موفقیت آمیز",
                detail: "با موفقیت به ارسال شد",
                life: 3000,
              });
            } else {
              this.$refs.toast.add({
                severity: "error",
                summary: "خطا",
                detail: response.data.message || "not status code 201",
                life: 3000,
              });
            }
          } else {
            const id = await this.getIdSchedule(
              this.id,
              this.term,
              this.academicYear
            );
            var response = await axios.put(
              `http://localhost:3000/professor/update-schedule/${id}`,
              infoSchedule,
              { withCredentials: true }
            );
            if (response.status == 200) {
              this.$refs.toast.add({
                severity: "success",
                summary: "موفقیت آمیز",
                detail: "با موفقیت تغییرات اعمال شد",
                life: 3000,
              });
            } else {
              this.$refs.toast.add({
                severity: "error",
                summary: "خطا",
                detail: response.data.message || "not status code 201",
                life: 3000,
              });
            }
          }
          console.log(response);
        } catch (err) {
          console.log(err);
          this.$refs.toast.add({
            severity: "error",
            summary: "خطا",
            detail: err.response.data.message || "خطا در ارسال به سرور",
            life: 3000,
          });
        }
      } else {
        let text = "برای تایید حداقل 10 ساعت  در هفته لازم است";
        this.$refs.toast.add({
          severity: "error",
          summary: "عدم ارسال",
          detail: text,
          life: 3000,
        });
      }
    },
    convertToApiFormat() {
      const daysMap = {};

      this.schedules.forEach((entry) => {
        if (!daysMap[entry.day]) {
          daysMap[entry.day] = {
            day: entry.day,
            timeSlots: [],
          };
        }

        daysMap[entry.day].timeSlots.push({
          startTime: entry.startTime,
          endTime: this.calculateEndTime(entry.startTime, entry.duration),
          task: entry.task,
          duration: entry.duration,
        });
      });

      return {
        days: Object.values(daysMap),
        academicYear: this.academicYear,
        term: this.term,
      };
    },
    calculateEndTime(startTime, duration) {
      const timeIndex = this.times.indexOf(startTime);
      const endIndex = timeIndex + duration - 1;
      return this.times[endIndex] || startTime;
    },
    getTime(day, time) {
      const entry = this.schedules.find(
        (entry) => entry.day === day && entry.startTime === time
      );

      return day + "   " + time + " الی" + "  " + entry.endTime;
    },
    hasTask(day, time) {
      return this.schedules.some(
        (entry) => entry.day === day && entry.startTime === time
      );
    },
    openModal(schedule) {
      if (!this.show) {
        this.editedSchedule = schedule ? { ...schedule } : null;
        this.showModal = true;
      }
    },
    closeModal() {
      this.editedSchedule = null;
      this.showModal = false;
    },
    isOverlapping(newEntry) {
      const newStartIndex = this.times.indexOf(newEntry.startTime);
      const newEndIndex = newStartIndex + newEntry.duration;

      return this.schedules.some((entry) => {
        if (entry.day !== newEntry.day) return false;
        const startIndex = this.times.indexOf(entry.startTime);
        const endIndex = startIndex + entry.duration;
        return (
          (newStartIndex >= startIndex && newStartIndex < endIndex) ||
          (newEndIndex > startIndex && newEndIndex <= endIndex) ||
          (newStartIndex <= startIndex && newEndIndex >= endIndex)
        );
      });
    },
    saveScheduleEntry(newEntry) {
      if (this.isOverlapping(newEntry)) {
        alert("این کار با کارهای موجود تداخل دارد.");
        return;
      }

      if (this.editedSchedule && this.editedSchedule?.id) {
        const index = this.schedules.findIndex(
          (entry) => entry.id === this.editedSchedule.id
        );
        if (index !== -1) {
          this.schedules.splice(index, 1, newEntry);
        }
      } else {
        newEntry.id = Date.now(); // Assign a unique id to the new entry
        this.schedules.push(newEntry);
      }

      this.closeModal();
    },
    deleteScheduleEntry() {
      if (this.editedSchedule) {
        const index = this.schedules.findIndex(
          (entry) =>
            entry.day === this.editedSchedule.day &&
            entry.startTime === this.editedSchedule.startTime
        );
        if (index !== -1) {
          this.schedules.splice(index, 1);
        }
        this.closeModal();
      }
    },

    getColSpan(day, time) {
      const entry = this.schedules.find(
        (entry) => entry.day === day && entry.startTime === time
      );
      if (entry) {
        const startIndex = this.times.indexOf(entry.startTime);
        const endIndex = this.times.indexOf(entry.endTime);
        return endIndex - startIndex + 1;
      }
      return 1;
    },
    getTask(day, time) {
      const entry = this.schedules.find(
        (entry) => entry.day === day && entry.startTime === time
      );
      return entry ? entry.task : "";
    },
    getSchedule(day, time) {
      const schedule = this.schedules.find(
        (entry) => entry.day === day && entry.startTime === time
      );
      if (schedule) return schedule;
      else
        return {
          day: day,
          startTime: time,
          duration: 1,
          task: this.tasksDefault[0],
        };
    },

    isMergedCell(day, time) {
      return this.schedules.some(
        (entry) =>
          entry.day === day &&
          this.times.indexOf(time) > this.times.indexOf(entry.startTime) &&
          this.times.indexOf(time) <
            this.times.indexOf(entry.startTime) + entry.duration
      );
    },
  },
};
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null; // اضافه کردن یک مقدار پیش‌فرض در صورتی که کوکی یافت نشود
}
</script>

 <style scoped>
.center-term {
  margin-right: 40%;
  display: flex;
  flex-direction: row;
}
.term-align {
  display: flex;
  flex-direction: row;
}
.head-time {
  background-color: #0056b3;
  border-radius: 10px;
  padding: 5px 2px;
  width: 75%;
  height: 50%;
}
.total-duration {
  color: green;
  font-size: large;
}
.term {
  margin-left: 20px;
}

.container-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
}
.top-buttons {
  margin-left: 100px;
}
.center-paragraph {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 120px;
  flex-grow: 1;
}

.add-button {
  margin-left: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.save-button {
  background-color: #009252;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.edit-button {
  background-color: #0056b3;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.save-button:hover {
  background-color: #009252;
}
.edit-button:hover {
  background-color: #007bff;
}
.add-button:hover {
  background-color: #0056b3;
}

.save-button:hover {
  background-color: #014226;
}
.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  overflow: auto;
  max-height: 100vh;
}
.schedule-table .task-added {
  background-color: #3572ef;
  margin-top: 5px;
  margin-bottom: 5px;
  color: white;
}
.day {
  background-color: #001c55;
  color: white;
}
.schedule-table th,
.schedule-table td {
  border: 1px solid #ddd;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
}
.schedule-table th {
  background-color: #001c55;
  color: white;
}

.scheduled {
  background-color: white;
  cursor: pointer;
}

.scheduled:hover {
  background-color: #0e46a3;
}
.table-container {
  overflow-x: auto;
}
</style>
