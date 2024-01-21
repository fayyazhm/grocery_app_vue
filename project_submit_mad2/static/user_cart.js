const user_cart=Vue.component("user_cart",{
    template:`
    <div>
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
    <h1 v-if="cart.length==0">No Items Added to the Cart</h1>
    <table v-if="cart.length!=0" class="table" style="width: 94%;margin-left: 50px;">
        <thead style="background-color:dimgrey;">
          <tr>
            <th style="width:53px" scope="col">SL_NO</th>
            <th scope="col">PRODUCT NAME</th>
            <th scope="col">PRODUCT PRICE</th>
            <th scope="col">PRODUCT QTY</th>
            <th scope="col">PRODUCT TOTAL</th>
            <th scope="col">ACTION</th>
          </tr>
        </thead>
          <tbody>
          <tr v-for="(i,index) in cart">
            <td><input type="number" v-bind:id="'product_quantity_'+i.cart_id" v-bind:value="index+1" readonly style="background-color: lightgrey;width:53px" /></td>
            <td v-for="c in prod" v-if="i.cart_product==c.product_id"><input type="text" v-bind:name="'product_name_'+ i.cart_id " v-bind:value="c.product_name.toUpperCase()" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:id="'product_qty_'+i.cart_id" v-bind:value="i.cart_productprice" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:id="'product_price_'+i.cart_id" v-model:value="i.cart_productqty" readonly style="background-color: lightgrey;" /></td>
            <td><input type="number" v-bind:id="'product_total_'+i.cart_id" v-model:value= "i.cart_productqty * i.cart_productprice" readonly style="background-color: lightgrey;"/></td>
            <td><div class="input-group">
                <span class="input-group-prepend">
                    <button v-on:click="decrease(i.cart_product)" class="btn btn-outline-secondary" type="button" style="background-color: mediumaquamarine;">-</button>
                </span>
                <input type="text" class="form-control text-center" v-model:value="i.cart_productqty" style="width: 0px !important;" readonly>
                <span class="input-group-append" style="margin-right: 30px;">
                    <button v-on:click="increase(i.cart_product,i.cart_productqty+1)" class="btn btn-outline-secondary" type="button" style="background-color: mediumaquamarine;">+</button>
                </span>
                <button v-on:click="del(i.cart_id)" class="input-group-append btn btn-danger" style="margin-right:20px" >
                <i class="bi bi-trash"></i>
                </button>
            </div>
            </td> 
          </tr>
          </tbody>
          <tr>
            <td colspan="4" style="text-align: left; padding-right: 20px;font-size: 25px;">FULL TOTAL FOR CHECKOUT</td>
            <td colspan="2"><input type="number" v-bind:name="'product_fulltotal_'+user.id" readonly v-model:value="total" style="background-color: lightgrey;font-size: 20px;width:256px"/></td>
          </tr>
          <tr>
            <td colspan="6">
              <div style="display: flex; justify-content: center;">
                <router-link :to="'/user/order/conf/' + user.id"><button v-on:click="cartsub" type="button" class="btn btn-success" style="color:black;">SUBMIT FOR CHECKOUT</button></router-link>
                <router-link :to="'/user/home/' + user.id"><button type="button" class="btn btn-success" style="color:black;margin-left:40px;width:210PX ;">GO BACK TO HOME</button></router-link>
              </div>
            </td>
          </tr>   
      </table>
      </div>
    `,    data(){
        return{ user:"", cat:"",prod:"",cart:"",dat:"",search:""}
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
            document.title= `${this.user.username.toUpperCase()} CART`
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
    increase(a,b){
        var available;
        
        for(const i of this.prod){
          if(i.product_id==a){
              available=i.product_quantity
          }
        }
        for(const c of this.cart){
            if(c.cart_product==a){
                if(c.cart_productqty < available ){
                    c.cart_productqty=c.cart_productqty+1
                    fetch(`/user/cart/${this.user.id}/${a}/${b}`).then((response)=>{return response.json()}).
                    then((data)=>{
                    if(data=="cart added successfully"){

                      window.location.reload()}
                    if(data=="error"){
                      alert("The requested quantity is currently not available")}
                    })
                    }
                else{
                      alert("maximum available qty reached")
                    }
            }
        }
    }
      ,
    decrease(a){
        for(const i of this.cart){
            if(i.cart_product==a){
                if(i.cart_productqty==0){
                    alert("cannot reduce further")
                }
                else{
                fetch(`/user/cart/${this.user.id}/${a}/9999999`).then((response)=>{return response.json()}).
                then((data)=>{
                if(data=="cart added successfully"){
                  window.location.reload()}
                if(data=="error"){
                  alert("The requested quantity is currently not available")}
                })
                }
            }
        }

},
del(a){
    fetch(`/user/cart/delete/${this.user.id}/${a}`).then(response=>{return response.json()}).then
    (data=>{
        if(data=="successfully deleted"){
            window.location.reload()
        }
        if(data=="error"){
            alert("cannot delete")
        }
    })
},
cartsub(){
  fetch(`/user/cart/edit/`)


}



    }
}
)

export default user_cart