<template>
  <div class="item single-pic">
    <div class="content">
      <span>{{title}}</span>
    </div>
    <img v-bind:src="imageList[0]" />
  </div>
</template>

<script>
  import BaseOptions from "./base.js";
  /**
   * @file feed流单图item
   * @author yuanxin
   */
  export default {
    extends: BaseOptions
  };
</script>

<style scoped>
  @import "./index.css";

  .item.single-pic {
    display: flex;
  }

  .single-pic .content {
    flex: 2;
    font-size: 17px;
    padding-right: 24px;
  }

  .single-pic img {
    width: 33%;
    display: block;
  }
</style>
