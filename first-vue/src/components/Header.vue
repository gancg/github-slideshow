<!--1.模板  页面结构-->

<template>
  <header>
    <h1>{{ titleMsg }}{{appMsg}}</h1>
    <button v-on:click="changeMsg">修改appMSG</button>
  </header>
</template>
<!--2.行为  处理逻辑-->
<script>
export default {
  name: 'header',
  props:{
    appMsg:{
      type:String,
      require:true
    }
  },
  data () {
    return {
      titleMsg: '头部信息！'
    }
  },
  methods:{
    changeMsg:function(){
      this.appMsg="我去"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--3.样式 页面css-->
<style scoped>
header{
  background:lightgreen;
  padding: 100px
}
h1, h2 {
  width: 100%;
  font-weight: normal;
  font-size: 30px;
  text-align: center
}
</style>
