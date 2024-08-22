<!-- :class="{ sent: message.isSent, received: !message.isSent }" -->
 <template>
  <Toast ref="toast" />
  <div class="chat-container">
    <div class="chat-header">
      <h3>ارسال به : {{ senderName }}</h3>
      <button @click="goBack" class="btn btn-primary">
        <span class="fa fa-arrow-circle-left"></span>
        برگشت به صفحه قبل
      </button>
    </div>

    <div class="chat-messages">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <img :src="getSrcImage(message)" class="avatar" alt="avatar" />
        <div
          :class="{
            sent: message.user == 'student',
            received: message.user !== 'student',
          }"
        >
          <p>{{ message.content }}</p>
          <span class="time">{{ message.time }}</span>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input
        :disabled="disableInput"
        type="text"
        v-model="newMessage"
        placeholder="پیام خود را وارد کنید"
        v-on:keyup.enter="sendMessage"
      />
      <button :disabled="disableInput" @click="sendMessage">ارسال</button>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
import { io } from "socket.io-client";

export default {
  props: ["data"],
  data() {
    return {
      messages: [],
      newMessage: "",
      professorId: this.$route.params.professorId,
      studentId: this.$route.params.studentId,
      socket: null,
      disableInput: false,
      senderName: this.$route.params.senderName,
      imageProfessor: this.$route.params.imageProfessor,
      imageStudent: this.$route.params.imageStudent,
      baseUrl: "http://localhost:3000",
    };
  },
  mounted() {
    this.socket = io("http://localhost:3000", { withCredentials: true });
    this.socket.emit("joinPrivateChat", {
      studentId: this.studentId,
      professorId: this.professorId,
      isStudent: this.$route.params.isStudent,
    });
    this.socket.on("receiveMessage", (message) => {
      this.messages.push(message);
    });
    this.socket.on("previousMessages", (messages) => {
      this.messages = messages;
    });
    this.socket.on("messages-overflow", (message) => {
      this.$refs.toast.add({
        severity: "error",
        summary: "ارسال پیش از حد پیام",
        detail: message,
        life: 3500,
      });
      this.disableInput = true;
    });
  },
  methods: {
    getSrcImage(message) {
      if (message.user == "student") {
        return `${this.baseUrl}${this.imageStudent}`;
      } else {
        return `${this.baseUrl}${this.imageProfessor}`;
      }
    },
    goBack() {
      window.history.back();
    },
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        const isStudent = this.$route.params.isStudent;

        const messageData = {
          senderId: isStudent === "true" ? this.studentId : this.professorId,
          user: isStudent === "true" ? "student" : "professor",
          content: this.newMessage,
          time: new Date().toLocaleTimeString(),
        };
        this.newMessage = "";
        this.socket.emit("sendMessage", messageData);
      }
    },
  },
};
</script>

<style>
.chat-container {
  margin: 1% auto auto auto;
  width: 100%;
  max-width: 60%;
  background: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.chat-header {
  background: #fff;
  height: 75px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: right;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.btn {
  /* margin-right: 50%; */
  font-family: "Vazir";
  height: 50px;
}
.chat-messages {
  height: 450px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  /* background-image: url("../assets/chat-bg.png"); */
  /* background-size: cover; */
  /* background-repeat: no-repeat; */
  /* background-position: center; */
}

.message {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.sent {
  max-width: 70%;
  background: #007bff;
  color: #fff;
  padding: 10px 15px;
  border-radius: 15px;
  position: relative;
}

.received {
  max-width: 70%;
  background: #fff;
  color: #000000;
  padding: 10px 15px;
  border-radius: 15px;
  position: relative;
}

.avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin: 0 12px;
}

.message-content {
  max-width: 70%;
  background: #007bff;
  color: #fff;
  padding: 10px 15px;
  border-radius: 15px;
  position: relative;
}

.message.received .message-content {
  background: #f1f1f1;
  color: #333;
}
h3 {
  font-family: "Vazir";
}
.message .time {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #bbb;
}

.chat-input {
  display: flex;
  padding: 10px;
  background: #fff;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  font-size: 14px;
}

.chat-input button {
  background: #007bff;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.chat-input button:hover {
  background: #0056b3;
}
</style>
