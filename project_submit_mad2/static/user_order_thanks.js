const user_order_thanks=Vue.component("user_order_thanks",{
    template:`<div>
    <div style="border:2px solid black;background-color:darkgrey;" class="d-flex justify-content-between">
      <div style="justify-content:flex-start">
        <h1 style="display:inline-block;font-size:30px ;">WELCOME:{{ user.username.toUpperCase() }}</h1>
      </div>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <router-link :to="'/user/profile/' + user.id" class="nav-link">PROFILE</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/user/order/' + user.id" class="nav-link">ORDERS</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/user/home/' + user.id" class="nav-link" >HOME</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/user/cart/' + user.id" class="nav-link">
            CART
              <span v-if="cart !=0" class="badge rounded-pill bg-success">{{ cart }}</span>
          </router-link>
        </li>
        <li class="nav-item">
            <div class="input-group">
              <input class="form-control" type="search" placeholder="Search Product" aria-label="Search" name="search" v-model:value="search" required>
              <div class="input-group-append">
                <button @click="searchpro" class="btn btn-outline-success my-2 my-sm-0" type="submit">SEARCH PRODUCT </button>
              </div>
              <div class="input-group-append">
                  <button @click="advancesearch" class="btn btn-outline-success my-2 my-sm-0" type="submit">ADVANCE SEARCH</button>
              </div>
            </div>
          <li class="nav-item">
            <a href="/logout" class="nav-link">LOGOUT</a>
          </li>
        </li>
      </ul>
    </div>
    <p style="font-size:30px;text-align:end;margin-right: 50px;">DATE : {{ dat }} </p>
    <br>
    <div class="center-container" style="margin-left:800px">
      <h2> Thank you For Ordering :-)</h2>
        <br>
      <h1>Order Number # {{ ordc[0].order_number }}</h1>
    </div>
      <div v-if="carno.length!=0"  v-for="l in carno">
      <p v-for="p in prod" v-if="l.cart_product == p.product_id" style="font-size: 20px;">Sorry {{ p.product_name }} is not available right now for the requested quantity!!!!</p>
      </div>
      <table class="table" style="width: 94%;margin-left: 50px;">
        <thead style="background-color:dimgrey;">
          <tr>
            <th style="width:53px" scope="col">SL_NO</th>
            <th scope="col">PRODUCT NAME</th>
            <th scope="col">PRODUCT PRICE</th>
            <th scope="col">PRODUCT QTY</th>
            <th scope="col">PRODUCT TOTAL</th>
          </tr>
        </thead>
          <tbody>
          <tr v-for="i in ordc">
            <td><input type="number" v-bind:name="'product_quantity_'+ i.order_number" v-bind:value="i.order_itemnumber" readonly style="background-color: lightgrey;width:53px" /></td>
            <td v-for="c in prod" v-if="i.order_productid == c.product_id"><input type="text" v-bind:name="'product_name_'+i.order_number" v-bind:value="c.product_name" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:name="'product_qty_'+ i.order_number" v-bind:value="i.order_itemprice" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:name="'product_price_'+i.order_number" v-bind:value="i.order_qty" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:name="'product_total_'+i.order_number" v-bind:value="i.order_qty  * i.order_itemprice" readonly style="background-color: lightgrey;" /></td>
          </tr>
          </tbody>
          <tr>
            <td colspan="4" style="text-align: left; padding-right: 20px;font-size: 25px;">FULL TOTAL</td>
            <td><input type="number" v-bind:name="'product_fulltotal_'+user.id" v-bind:value="tot.total_orderamount" readonly style="background-color: lightgrey;font-size: 20px;width:256px" /></td>
          </tr>
          <tr>
          <td colspan="5" style="text-align: center;" >
            <h2>Your Order will be Delivered to</h2>
            <p style="font-size:20px;">{{ tot.total_orderaddress.toUpperCase() }},</p>
            <p style="font-size:20px;">{{ tot.total_orderaddress2.toUpperCase() }},</p>
            <p style="font-size:20px;">{{ tot.total_ordercity.toUpperCase() }},</p>
            <p style="font-size:20px;">{{ tot.total_orderstate.toUpperCase() }},</p>
            <p style="font-size:20px;">{{ tot.total_orderzip }}</p>
            <p style="font-size:20px;"> Your Order Will Be Delivered Before:{{ delivery_date }}</p>
          </td>
          </tr>      
      </table>
      </div>
    `,
    props:['c','d','e','f','g','h'],
    data(){
        return{
            carno:"",cart:"",dat:"",prod:"",user:"",ordc:"",tot:"",delivery_date:""
        }
    },
    mounted(){
        const data={address:this.d,address2:this.e,city:this.f,state:this.g,zip:this.h}
        fetch(`/user/order/${this.c}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).
      then(response=>{return response.json()}).
      then(
      data=>{
        this.carno=data["carno"]
        this.cart=data["cart"]
        this.dat=data["dat"].substring(0,17)
        this.prod=data["prod"]
        this.user=data["user"]
        this.ordc=data["ordc"]
        this.tot=data["tot"]
        this.delivery_date=data["delivery_date"].substring(0,17)
    })

},
methods:{
    searchpro(){
      if(this.search==''){alert("please enter text")}
      else{
      this.$router.push(`/user/search/${this.user.id}/${this.search}`)
      window.location.reload()}
    },
    advancesearch(){
      this.$router.push(`/user/advsearch/${this.user.id}`)
    }
}

})

export default user_order_thanks