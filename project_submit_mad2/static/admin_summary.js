const admin_summary= Vue.component("admin_summary",{
    template:`  
    <div class="text-left" style="position: relative;top: 240px;width: 60%;left: 80px;">
    <div class="row" style="background-color: steelblue;border: 2px solid black;" >
      <div style='margin-left: 20px;'class="col">
        <router-link to="/admin/summary/product" style="text-decoration: none"> <a style="text-decoration: none;color: black;"><h1>1.PRODUCT WISE DETAILS</h1></a></router-link>
        <br>
        <router-link to="/admin/summary/category" style="text-decoration: none"> <a style="text-decoration: none;color: black;"><h1>2.CATEGORY WISE DETAILS</h1></a></router-link>
        <br>
        <router-link to="/admin/summary/order" style="text-decoration: none" ><a style="text-decoration: none;color: black;"><h1>3.ORDER SUMMARY</h1></a></router-link>
      </div>
      </div>
    </div>`,
})

export default admin_summary