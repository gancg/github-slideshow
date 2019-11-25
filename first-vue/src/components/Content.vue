<!--1.模板  页面结构-->

<template>
  <div class="content">
    <ul>
      <li v-for="office in works"  v-on:click="office.showFlag=!office.showFlag">
        <h2>{{office.name}}</h2>
        <h3 v-show="office.showFlag">{{office.address}}</h3>
        <button v-on:click="removeThis">删除</button>
      </li>
    </ul>
    
  </div>
</template>
<!--2.行为  处理逻辑-->
<script>
export default {
  name: 'content',
  props:{
    works:{
      type:Array,
      required:true
    }
  },
  data () {
    return{

    }
  },
  methods:{
    removeThis:function(){
      this.works.pop();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--3.样式 页面css-->
<style scoped>
.content{
  width: 100%;
  max-width: 1200px;
  margin:20px auto;
  padding:0 20px;
  box-sizing: content-box;
}
ul{
  display:flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding:2px;
}
li{
  flex-grow: 1;
    flex-basis: 300px;
    text-align: center;
    padding: 30px;
    border: 1px solid #222;
    margin: 10px;
}
</style>
