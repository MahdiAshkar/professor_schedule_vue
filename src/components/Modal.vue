<template>
  <div class="modal">
    <div class="modal-content">
      <div class="header">
        <span class="close fa fa-close" @click="$emit('close')"></span>
        <h3>{{ task }}</h3>
      </div>
      <form @submit.prevent="save" class="modal-form">
        <div class="form-row">
          <div class="form-group">
            <label for="day">روز:</label>
            <select v-model="day" required>
              <option v-for="day in days" :key="day">{{ day }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="startTime">از ساعت:</label>
            <select v-model="startTime" required>
              <option v-for="time in times" @change="updateEndTime" :key="time">
                {{ time }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="endTime">تا ساعت:</label>
            <select v-model="endTime" required>
              <option v-for="time in availableEndTimes" :key="time">
                {{ time }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <div class="radio-group">
            <div v-for="defaultTask in tasksDefault" :key="defaultTask">
              <input type="radio" v-model="task" :value="defaultTask" />
              <label>{{ defaultTask }} </label>
            </div>

            <label
              ><input type="radio" v-model="task" value="سایر" /> سایر</label
            >
            <div class="otherInput">
              <input
                v-if="task === 'سایر'"
                type="text  "
                v-model="customTask"
                placeholder="مقدار دلخواه"
              />
            </div>
          </div>
        </div>

        <div class="btn">
          <button
            v-if="editedSchedule"
            class="remove"
            @click.prevent="deleteTask"
          >
            حذف
          </button>
          <button class="save" type="submit">ذخیره</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editedSchedule: Object,
    days: Array,
    times: Array,
    tasksDefault: Array,
  },

  data() {
    return {
      day: this.editedSchedule ? this.editedSchedule.day : "شنبه",
      startTime: this.editedSchedule ? this.editedSchedule.startTime : "8:00",
      endTime: this.editedSchedule ? this.editedSchedule.endTime : "9:00",
      task: this.editedSchedule
        ? this.editedSchedule.task
        : this.tasksDefault[0],
      customTask: "",
    };
  },
  computed: {
    getFirstTask() {
      return this.defaultTask[0];
    },
    availableEndTimes() {
      const startIndex = this.times.indexOf(this.startTime);
      return this.times.slice(startIndex + 1);
    },
  },
  methods: {
    updateEndTime() {
      if (
        this.times.indexOf(this.endTime) <= this.times.indexOf(this.startTime)
      ) {
        this.endTime = this.availableEndTimes[0] || "";
      }
    },
    save() {
      let duration =
        this.times.indexOf(this.endTime) -
        this.times.indexOf(this.startTime) +
        1;

      this.$emit("save", {
        day: this.day,
        startTime: this.startTime,
        endTime: this.endTime,
        task: this.customTask == "" ? this.task : this.customTask,
        duration,
      });
    },
    deleteTask() {
      this.$emit("delete");
    },
  },
};
</script>

<style scoped>
.remove {
  background-color: #d9534f;
  padding-right: 25px;
  padding-left: 25px;
  padding-top: 4px;
  padding-bottom: 10px;
  margin-right: 10px;
}

.save {
  padding-right: 25px;
  padding-left: 25px;
  padding-top: 4px;
  padding-bottom: 10px;
}

.btn {
  display: flex;
  flex-direction: row-reverse;
}

.radio-group div {
  margin-bottom: 5px;
}

.radio-group input[type="text"] {
  margin-top: 10px;
}

h3 {
  font-family: "Vazir";
  color: white;
}
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 5px;
  border: 1px solid #888;
  width: 30%;
}
.header {
  border-radius: 7px;
  background-color: #001c55;
  /* rgb(240, 153, 14); */
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  height: 50px;
  margin: 5px 0 0 0;
  padding: 10px;
}
.close {
  color: red;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.modal-form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 5% auto;
}

.radio-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 12px;
}

.otherInput {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  padding-right: 5px;
  margin-bottom: 7px;
}

input,
select {
  padding: 5px;
  font-size: 15px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}
</style>
