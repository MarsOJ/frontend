<script setup></script>

<template>
  <div class="footer">
    <div class="container">
      <hr />
      <p>Copyright &copy;2022 MarsOJ 信奥资讯 All rights reserved.</p>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

hr {
  height: 1px;
  border-width: 0;
  margin: auto;
  color: #403f4e;
  background-color: #403f4e;
}

.footer {
  border-top: 3px solid #00a8b1;
  border-bottom: 3px solid #00a8b1;
  background-color: #21202e;
  margin: 0;
  padding: 80px 0 16px;
  width: 100%;
  text-align: center;
}

.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  color: #c4c4c4;
  font-size: 15px;
}

.container p {
  padding: 16px 0 16px;
}

@media (min-width: 1200px) {
  .container {
    width: 1170px;
  }
}

@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}

@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}
</style>
