此项目由深圳市万墨信息科技有限公司开发，如果有任何疑问请联系开发团队。
1、安装node (注意将Bin添加环境变量Path中)
  1>下载node[](https://nodejs.org/en/download/)
2、安装vue
npm install -g @vue/cli

3、创建项目
  1>vue create 项目名称
  2>选择手动(Manually select features)
  3>[chose vue version,Babel,Router,Vuex]
  4>3.x
  5>Use history for route (Y)
  6>In package.json
  7>save this config(N)

4、进入项目目录(安装依赖)
npm install axios --save
npm install @icon-park/vue-next --save
npm install @element-plus/icons-vue
npm install element-plus --save
npm install echart --save
npm install mitt
npm i -S vuedraggable@next
npm install jquery --save;
npm install vue3-print-nb
5、运行项目
npm run serve

6、发布项目
npm run build


授权逻辑：根据在菜单管理页面配置的权限如权限erp:wh:shelf:add 则可以在组件中加入如下类容,v-hasPerm为权限关键子
在文件utils/permission.js中配置
<div class="myclass" v-hasPerm="'erp:wh:shelf:add'">  test</div>