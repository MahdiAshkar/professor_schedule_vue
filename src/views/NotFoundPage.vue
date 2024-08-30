<template>
  <div>
    <img src="/images/404.png" />
    <p class="title">صفحه مورد نظر یافت نشد</p>
    <p>این صفحه وجود ندارد یا شما دسترسی ندارید.</p>
    <router-link to="/">بازگشت به صفحه اصلی</router-link>
  </div>
</template>
  
  <script>
export default {
  name: "NotFound",
};
</script>
<style scoped>
.title {
  font-size: 30px;
}
div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
</style>
  