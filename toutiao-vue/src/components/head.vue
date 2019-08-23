<template>
  <nav>
    <div class="nav-content">
      <span
        v-bind:key="key"
        v-for="(tab, key) in tabs"
        v-bind:data-name="key"
        v-on:click="$emit('select', key)"
      >{{tab.label}}</span>
    </div>

    <a class="more_btn" v-on:click.prevent="$emit('more')">
      <span class="cross"></span>
    </a>
  </nav>
</template>

<script>
export default {
  props: ["tabs"],
  // inject: ['tabs'],

  // data() {
  //     console.log('tttthis.tabshis.tabshis.tabshis.tabs: ', this.tabs);
  //     return {
  //         tabs: this.tabs
  //     };
  // },
  mounted() {
    // console.log('head:::', this.tabs);
  },

  methods: {}
};
</script>

<style scoped>
  nav {
    display: flex;
  }
  .nav-content {
    flex: 1;
    white-space: nowrap;
    overflow-x: scroll;
    position: relative;
  }
  span {
    display: inline-block;
    padding: 10px;
  }

  .more_btn {
    display: block;
    position: relative;
    width: 34px;
    height: 34px;
    color: #f85959;
    text-align: center;
    background: #f4f5f6;
  }
  .cross {
    position: absolute;
    width: 17px;
    height: 17px;
    opacity: 0.9;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .cross:before,
  .cross:after {
    position: absolute;
    content: " ";
    height: 17px;
    width: 4px;
    background-color: #f85959;
  }

  .cross:before {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
</style>
