<template>
  <section>
    <div class="toolbar">
      <router-link tag="span" class="backBtn" to="/page/">
        <a></a>
      </router-link>
    </div>
    <div class="content">
      <router-view></router-view>
      这里是详情页！{{$route.params.id}}
    </div>
    <div>
      <span @click="this.goMain">回主页</span>
      <span @click="this.goSetting">回设置</span>
    </div>
  </section>
</template>
<script>
export default {
  // beforeRouteUpdate(to, from, next) {
  //   console.log('to:', to);
  //   console.log('from:', from);
  //   next();
  // },
  // watch: {
  //   "$route": (to, from) => {
  //     console.log('to:', to);
  //     console.log('from:', from);
  //   }
  // },
  methods: {
    goMain() {
      this.$router.push('/page');
      
    },
    goSetting() {
      this.$router.replace('/setting');
    }
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
</style>