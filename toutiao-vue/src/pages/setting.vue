<template>
  <div>
    <div class="toolbar">
      <!-- <span class="backBtn" v-on:click="$emit('more', 'hide')"><a></a></span> -->
      <router-link to="/page">
        <a>返回</a>
      </router-link>
      <span class="title">
        <a href>频道管理</a>
      </span>
    </div>
    <ul class="controlDetail">
      <li class="channelFigure tuijian" v-for="(tab, key) in tabs" v-bind:key="key">
        <a>{{tab.label}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ["tabs"],
    created() {
      console.log("router in setting:", this.$route);
    }
  };
</script>

<style scoped>
  .toolbar {
    width: 100%;
    height: 50px;
    position: relative;
    background-color: #d43d3d;
  }

  .toolbar span {
    display: block;
    text-align: center;
    line-height: 50px;
    font-weight: 700;
  }

  .toolbar span.backBtn {
    width: 44px;
    height: 50px;
    position: absolute;
    left: 0;
    top: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
  }

  .toolbar span.backBtn a {
    width: 50%;
    height: 50%;
    background: url(//s3a.pstatp.com/growth/wap_misc/image/header_back_86a065fc5fe6605cd32e26fe9a2c9f37.png)
      no-repeat 50%;
    background-size: 100%;
    display: block;
  }

  .channelFigure {
    display: inline-block;
    width: 25%;
    margin-bottom: 10px;
    -webkit-animation: zoomIn 0.3s ease;
    animation: zoomIn 0.3s ease;
  }

  li,
  ul {
    list-style-type: none;
    padding: 0;
  }

  .tuijian a {
    background-color: #f0f0f0;
  }

  .channelFigure a {
    font-size: 16px;
    display: block;
    margin: 0 8px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 2em;
  }
</style>
