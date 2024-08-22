
<template>
  <div class="section-table">
    <table class="table">
      <thead>
        <tr>
          <th>عملیات</th>
          <th>گیرنده</th>
          <th>تعداد گفتگو</th>
          <th>تاریخ و زمان ثبت</th>
          <th>وضعیت</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="conversation in conversations" :key="conversation.roomId">
          <td>
            <button
              @click="
                showDetails(
                  conversation.roomId,
                  conversation.professorId.name,
                  conversation.studentId.image,
                  conversation.professorId.image_profile
                )
              "
            >
              نمایش
            </button>
          </td>
          <td>دکتر {{ conversation.professorId.name }}</td>
          <td>{{ conversation.messages.length }}</td>
          <td>
            {{ getTime(conversation.createdAt)[0] }} /{{
              getTime(conversation.createdAt)[1]
            }}
          </td>
          <td :class="{ 'text-success': conversation.status }">
            {{ conversation.status ? "پاسخ داده شده" : "پاسخ داده نشده" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  
  
  <script>
import axios from "axios";
import moment from "jalali-moment";

export default {
  props: ["data"],
  data() {
    return {
      conversations: [],
      student: this.data,
      baseUrl: "http://localhost:3000",
    };
  },
  mounted() {
    this.student = this.data;
    this.fetchConversations();
  },
  methods: {
    getTime(date) {
      moment.locale("fa", { useGregorianParser: true });
      const iranTime = moment(date).format().split("T");
      const dateShamsi = iranTime[0];
      const time = iranTime[1].split("+")[0];
      return [dateShamsi, time];
    },

    async fetchConversations() {
      try {
        const res = await axios.get(
          `${this.baseUrl}/s/conversations/${this.student._id}`
        );
        this.conversations = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    showDetails(roomId, senderName, imageStudent, imageProfessor) {
      const studentId = roomId.split("-")[0];
      const professorId = roomId.split("-")[1];
      this.$router.push({
        name: "chatPage",
        params: {
          studentId,
          professorId,
          senderName,
          imageProfessor,
          imageStudent,
          isStudent: true,
        },
      });
    },
  },
};
</script>
  
  
  <style scoped>
.table td button {
  background: #007bff;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.section-table {
  margin-top: 5%;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ccc;
}

.table th {
  background-color: #f8f9fa;
}

.text-success {
  color: green;
}
</style>