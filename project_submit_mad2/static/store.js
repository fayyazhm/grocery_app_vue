import categ_store from "./categ_store.js";
import category_already from "./category_already.js";
import product_action_store from "./product_action _store.js";
import product_delete_store from "./product_delete_store.js";
import add_product_store from "./add_product_store.js";
import category_edit_store from "./category_edit _store.js";
import category_delete_confirm_store from "./category_delete_confirm_store.js";
import add_category_store from "./add_category_store.js";
import store_requests from "./store_requests.js";
import product_delete_error from "./product_delete_error.js";

const routes = [
    {path: "/", component: categ_store },
    {path:"/category_already/:c",component:category_already,props:true},
    {path:"/store/product/edit/:c",component:product_action_store,props:true},
    {path:"/store/product/delete/conf/:c",component:product_delete_store,props:true},
    {path:"/store/product/:c",component:add_product_store,props:true},
    {path:"/store/category/edit/:c",component:category_edit_store,props:true},
    {path:"/store/category/delete/confirm/:c",component:category_delete_confirm_store,props:true},
    {path:"/store/category",component:add_category_store},
    {path:"/Requests",component:store_requests},
    {path:"/product/delete/error/:c",component:product_delete_error,props:true},
    {path:"/store/home",component:categ_store}
  ];
  
  const router = new VueRouter({ routes });
  
  const a = new Vue({
    el: "#app2",
    router,
  });
  