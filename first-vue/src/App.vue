<template>
  <div id="app">
    <!-- 
       <img src="./assets/logo.png">
      <h1>{{appMsg}}</h1>
      
      
       -->
    <app-header v-bind:appMsg="appMsg"></app-header>
    <app-content v-bind:works="officeWorkers"></app-content>
    <app-content v-bind:works="officeWorkers"></app-content>
    <app-footer v-bind:appMsg1="appMsg" v-on:fatherTitleChangedEvent="fatherChanged($event)"></app-footer>
  </div>
</template>

<script>
import header from './components/Header';
import content from './components/Content';
import footer from  './components/Footer';
/* 编译引入组件 */
export default {
  name: 'App',
  components: {
    'app-header':header,
    'app-content':content,
    'app-footer':footer
  },
  data(){
    return {
      appMsg:"属于APP的data",
      officeWorkers: [
         {name:'zhangsan',address:'红牌楼',showFlag:true},
         {name:'zhangsan',address:'红牌楼',showFlag:true},
         {name:'zhangsan',address:'红牌楼',showFlag:true},
         {name:'zhangsan',address:'红牌楼',showFlag:true},
         {name:'zhangsan',address:'红牌楼',showFlag:true},
         {name:'zhangsan',address:'红牌楼',showFlag:true},
         {name:'zhangsan',address:'红牌楼',showFlag:true},
      ]
    }
  },
  methods:{
    fatherChanged(obk){
      this.appMsg=obk;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
