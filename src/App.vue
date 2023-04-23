<script>
import { RouterLink, RouterView } from "vue-router";
import IconSetting from "@/components/icons/IconSetting.vue";
import IconHome from "@/components/icons/IconHome.vue";

</script>
<template>
  <nav class="navbar">
    <div class="home">
      <RouterLink to="/">
        <IconHome />
      </RouterLink>
    </div>
    <div class="setting">
      <RouterLink to="/time_setting">
        <IconSetting />
      </RouterLink>
    </div>
  </nav>
  <RouterView />
</template>
<style lang="less" scoped>
nav {
  float: right;
  right:20px;
  position: relative;
}

nav {
  .home,.setting {
    // display: block;
    width: 40px;
    height: 40px;
    background-color: #f38181;
    border-radius: 30px;
    text-align: center;
    display: flex;
    margin: 5px auto;
    justify-content: center;
    align-items: center;
    &:hover{
    background-color: #ff2e63;
  }
  }
  
  svg {
    fill: #fff;
    margin: 0 auto;
    width: 1.5em;
    height: 1.5em;
    overflow: hidden;
  }

}
</style>
