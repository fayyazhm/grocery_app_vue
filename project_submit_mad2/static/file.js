import add_category from "./add_category.js";
import add_product from "./add_product.js";
import categ from "./categ.js";
import category_already from "./category_already.js";
import category_delete_confirm from "./category_delete_confirm.js";
import category_edit from "./category_edit.js";
import product_action from "./product_action.js";
import product_delete from "./product_delete.js";
import admin_summary from "./admin_summary.js";
import product_summary from "./product_summary.js";
import category_summary from "./category_summary.js";
import category_product_summary from "./category_product_summary.js";
import order_summary from "./order_summary.js";
import order_numbersummary from "./order_numbersummary.js";
import admin_authorization from "./admin_authorization.js";


const routes = [
    {path: "/", component: categ },
    {path:"/admin/category",component:add_category},
    {path:"/category_already/:c",component:category_already,props:true},
    {path:"/admin/category/edit/:c",component:category_edit,props:true},
    {path:"/admin/category/delete/confirm/:c",component:category_delete_confirm,props:true},
    {path:"/admin/product/:c",component:add_product,props:true},
    {path:"/admin/product/edit/:c",component:product_action,props:true},
    {path:"/product/delete/conf/:c",component:product_delete,props:true},
    {path:"/admin/summary",component:admin_summary},
    {path:"/admin/summary/product",component:product_summary},
    {path:"/admin/summary/category",component:category_summary},
    {path:"/admin/summary/category/:c",component:category_product_summary,props:true},
    {path:"/admin/summary/order",component:order_summary},
    {path:"/admin/order/:c",component:order_numbersummary,props:true},
    {path:"/admin/authorization",component:admin_authorization},
    {path:"/admin/home",component:categ}
  ];
  
  const router = new VueRouter({ routes });
  
  const a = new Vue({
    el: "#app",
    router,
  });
  