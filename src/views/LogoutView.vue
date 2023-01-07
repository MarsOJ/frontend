<script setup>
import { ElMessageBox } from "element-plus";
</script>

<script>
export default {
  methods: {
    alertMessage(msg, title) {
      ElMessageBox.alert(msg, title, {
        confirmButtonText: "确认",
      });
    },
  },
  created() {
    this.$store.dispatch("auth/logout").then(
      () => {
        // Logout successful
        console.log("Successful");
        this.alertMessage("已成功退出登录！", "登出成功");
        this.$router.push("/login");
      },
      (error) => {
        // Register failed
        console.log("Error information!", this.newUser);
        var msg =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        this.errorMessage(msg, "登出失败");
        this.$router.back();
      }
    );
  },
};
</script>
