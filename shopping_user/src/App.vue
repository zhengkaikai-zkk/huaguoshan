<template>
  <div id="app">
    <router-view v-if="showWX"/>
    <div class="d_wx_app" v-else>
      <div><img src="./assets/img/common/wx_app.png" alt=""></div>
      请在微信客户端打开链接
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      showWX: true,
    }
  },

  mounted(){
    if(this.isWeiXin()){
      console.log(" 是来自微信内置浏览器");
        
    }else{
      console.log("不是来自微信内置浏览器");
      // this.showWX=false;
    }
  },

  methods: {
    isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        }
        else {
            return false;
        }
    }
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Segoe UI", Tahoma,
    SimSun, sans-serif;
}
textarea {
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Segoe UI", Tahoma,
    SimSun, sans-serif !important;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #707070;
  background-color: #f5f5f5;
  letter-spacing: 1px;
  -webkit-overflow-scrolling: touch;
  /* font-family: 'SourceHanSansCN-Normal'; */
}

body.modal-open {
  position: fixed;
  width: 100%;
}
@font-face {
  font-family: "SourceHanSansCN-Normal";
  src:url("./assets/font/SourceHanSansCN-Normal.woff") format("woff"),
      url("./assets/font/SourceHanSansCN-Normal.svg") format("svg");
}

ul,
ol,
li {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

i {
  font-style: normal;
}

img{
  /* pointer-events: none; */
}

input,
textarea {
  outline: none;
}

input[type="text"],
input[type="button"],
input[type="submit"] {
  /*appearance: none;*/
  -webkit-appearance: none;
}

input[type="button"],
input[type="button"] {
  cursor: pointer;
}
input::-webkit-input-placeholder {
  color: #C0C8D3 !important;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #C0C8D3 !important;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #C0C8D3 !important;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #C0C8D3 !important;
}

textarea::-webkit-input-placeholder {
  color: #707070 !important;
}

textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #707070 !important;
}

textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #707070 !important;
}

textarea:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #707070 !important;
}
button{
	background-color: transparent;
	border: 0;
	outline: none;
	cursor: pointer;
}
button:disabled{
	cursor: text;
}
.no_data{
  text-align: center;
  color: #888;
}
.d_wx_app{
  background: #fff;
  height: 80vh;
  color: #333;
  font-size: 1.6rem;
  text-align: center;
  padding-top: 20vh;
}
.d_wx_app img{
  width: 10rem;
  margin-bottom: 1rem;
}

</style>


