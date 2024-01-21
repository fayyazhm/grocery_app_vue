import user_homepage from "./user_homepage.js";
import user_profile from "./user_profile.js";
import user_already from "./user_already.js";
import user_orders from "./user_orders.js";
import user_product_search from "./user_product_search.js";
import user_advance_search from "./user_advance_search.js";
import user_advsearch_page from "./user_advsearch_page.js";
import user_advsearch_order from "./user_advsearch_order.js";
import user_cart from "./user_cart.js";
import user_order_conf from "./user_order_conf.js";
import user_order_thanks from "./user_order_thanks.js";



const routes = [
  {path:"",component:user_homepage},
  {path:"/user/profile/:c",component:user_profile,props:true},
  {path:"/user/already/:c/:d",component:user_already,props:true},
  {path:"/user/order/:c",component:user_orders,props:true},
  {path:"/user/search/:c/:d",component:user_product_search,props:true},
  {path:"/user/advsearch/:c",component:user_advance_search,props:true},
  {path:"/user/advsearch/:c/:d/:e",component:user_advsearch_page,props:true},
  {path:"/user/order/advsearch/:c/:d",component:user_advsearch_order,props:true},
  {path:"/user/home/:c",component:user_homepage,props:true},
  {path:"/user/cart/:c",component:user_cart,props:true},
  {path:"/user/order/conf/:c",component:user_order_conf,props:true},
  {path:"/user/order/thanks/:c/:d/:e/:f/:g/:h",component:user_order_thanks,props:true}
  ];
  
  const router = new VueRouter({ routes });
  
  const b = new Vue({
    el: "#app1",
    router,
  });
  