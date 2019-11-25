<!--1.模板  页面结构-->

<template>
<div>
<p class='footer'>{{ companyMsg }}{{appMsg1}}      
</p>
<button v-on:click="reverseMsg">反向传值</button>
  
</div>
    
    
</template>
<!--2.行为  处理逻辑-->
<script>
export default {
  name: 'footer',
  props:{
    appMsg1:{
      type:String,
      required:true
    }
  },
  data () {
    return {
      companyMsg: '某某某坑逼公司的尾页'
    }
  },
  methods:{
    reverseMsg:function(){
      this.$emit("fatherTitleChangedEvent","变成这样了哦！");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--3.样式 页面css-->
<style scoped>
.footer {
  margin-bottom: 10px;
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  background-color: aquamarine
}
</style>
