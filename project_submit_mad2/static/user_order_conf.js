const user_order_conf=Vue.component("user_order_conf",{
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
              <span v-if="cart.length!=0" class="badge rounded-pill bg-success">{{ cart.length }}</span>
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
          <tr v-for="(i,index) in cart">
            <td><input type="number" v-bind:id="'product_quantity_'+i.cart_id" v-bind:value="index+1" readonly style="background-color: lightgrey;width:53px" /></td>
            <td v-for="c in prod" v-if="i.cart_product==c.product_id"><input type="text" v-bind:name="'product_name_'+ i.cart_id " v-bind:value="c.product_name.toUpperCase()" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:id="'product_qty_'+i.cart_id" v-bind:value="i.cart_productprice" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:id="'product_price_'+i.cart_id" v-model:value="i.cart_productqty" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:id="'product_total_'+i.cart_id" v-model:value= "i.cart_productqty * i.cart_productprice" readonly style="background-color: lightgrey;"/></td> 
          </tr>
          </tbody>
          <tr>
            <td colspan="4" style="text-align: left; padding-right: 20px;font-size: 25px;">FULL TOTAL FOR CHECKOUT</td>
            <td colspan="1"><input type="number" v-bind:name="'product_fulltotal_'+user.id" readonly v-model:value="total" style="background-color: lightgrey;font-size: 20px;width:256px" /></td>
          </tr>
          <tr >
              <td colspan="5">
                <div style="margin-left: 620px;margin-right: -330px;">
                  <h1 style="margin-left:-20px">ENTER THE DELIVERY ADDRESS</h1>
                  <div class="form-group col-md-4">
                    <label for="inputAddress">ADDRESS</label>
                    <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St" name="address" v-model:value="address_new" style="background-color: lightgrey;">
                  </div>
                  <br>
                  <div class="form-group col-md-4">
                    <label for="inputAddress2">ADDRESS 2</label>
                    <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" name="address2" v-model:value="address2_new" style="background-color: lightgrey;">
                  </div>
                  <br>
                  <div class="form-group col-md-4">
                    <label for="inputCity">CITY</label>
                    <input type="text" class="form-control" id="inputCity" name="city" v-model:value="city_new" style="background-color: lightgrey;">
                  </div>
                  <br>
                  <div class="form-group col-md-4">
                    <label for="inputState">STATE</label>
                    <input type="text" class="form-control" id="inputstate" name="state" v-model:value="state_new" style="background-color: lightgrey;">
                  </div>
                  <br>
                  <div class="form-group col-md-4">
                    <label for="inputZip">ZIP</label>
                    <input type="text" class="form-control" id="inputZip" name="zip" v-model:value="zip_new" style="background-color: lightgrey;">
                  </div>
              </div>
              </td>  
          </tr>
          <tr> 
          <tr>
            <td colspan="5">
              <div style="display: flex; justify-content: center;margin-right:120px">
                <button type="button" v-on:click="checkout" class="btn btn-success" style="color:black;">ORDER CONFIRMATION</button>
                <router-link :to="'/user/cart/' + user.id"><button type="button" class="btn btn-success" style="color:black;margin-left:40px;width:210PX ;">GO BACK TO CART</button></router-link>
              </div>
            </td>
          </tr>   
      </table>
      </div>`,
      props:["c"],
      data(){
        return{ user:"", cat:"",prod:"",cart:"",dat:"",search:"",address_new:"",address2_new:"",city_new:"",state_new:"",zip_new:""}
    },
    mounted(){  
        fetch("/user/homepage").then((response)=>{return response.json()}).
        then((data)=>
        {
            this.user=data["user"]
            this.cat=data["cat"]
            this.prod=data["prod"]
            this.cart=data["cart"]
            this.dat=data["date"].substring(0,17)
            this.address_new=this.user.address
            this.address2_new=this.user.address2
            this.city_new=this.user.city
            this.state_new=this.user.state
            this.zip_new=this.user.zip
            document.title= `User Order Confirmation  ${this.user.username.toUpperCase()}`
        }
        )
    },
    computed:{
        total(){
            let tota=0;
            for(const i of this.cart){
                tota=tota+(i.cart_productqty*i.cart_productprice)
            }
            return tota
        }

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
    ,
    checkout(){
        if(this.address_new =="" || this.address2_new ==""||this.city_new =="" ||this.state_new==""||this.zip_new==""){
          alert("please fill all the address fields with valid value")
        }
        else{this.$router.push(`/user/order/thanks/${this.c}/${this.address_new}/${this.address2_new}/${this.city_new}/${this.state_new}/${this.zip_new}`)}
    }
}
}
)

export default user_order_conf