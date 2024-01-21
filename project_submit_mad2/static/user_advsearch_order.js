const user_advsearch_order=Vue.component("user_advsearch_order",{
    template:`
    <div>
    <div style='border:2px solid black;background-color:darkgrey;' class="d-flex justify-content-between">
    <div style="justify-content:flex-start">
      <h1 style="display:inline-block;font-size:30px ;">WELCOME:{{ user.username.toUpperCase() }}</h1>
    </div>
    <ul class="nav justify-content-end">
      <li class="nav-item">
        <router-link :to="'/user/order/' + user.id" class="nav-link">ORDERS</router-link>
      </li>
      <li class="nav-item">
        <router-link :to="'/user/home/' + user.id" class="nav-link" >HOME</router-link>
      </li>
      <li class="nav-item">
        <router-link :to="'/user/cart/' + user.id" class="nav-link">
          CART
            <span v-if="cart!=0" class="badge rounded-pill bg-success">{{ cart }}</span>
        </router-link>
      </li>
      <li class="nav-item">
          <div class="input-group">
            <input class="form-control" type="search" placeholder="Search Product" aria-label="Search" v-model:value="search" name="search" required>
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
  <h1 v-if="ordl.length==0">No Such Order</h1>
  <div class="container text-center">
    <div v-for="a in ordl" class="row" id="rcorners3"> 
      <h1> Order Number # {{ a[0].order_number }} </h1>
      <p v-for="m in tot" v-if="m.total_ordernumber==a[0].order_number" style="font-size:20px;text-align:end;margin-right: 50px;">ORDER DATE : {{ m.total_orderdate.substring(0,17) }} </p>    
      <table  class="table">
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
            <tr v-for="i in a">
              <td><input type="number" v-bind:name="'product_quantity_'+i.order_number " v-bind:value= "i.order_itemnumber" readonly style="background-color: lightgrey;width:53px" /></td>
              <td v-for ="c in prod" v-if="i.order_productid==c.product_id" ><input type="text" v-bind:name="'product_name_'+ i.order_number "  v-bind:value= "c.product_name" readonly style="background-color: lightgrey;" /></td>
              <td><input type="number" v-bind:name="'product_price_'+i.order_number "  v-bind:value= "i.order_itemprice" readonly style="background-color: lightgrey;" /></td>
              <td><input type="number" v-bind:name="'product_qty_'+i.order_number "  v-bind:value= "i.order_qty" readonly style="background-color: lightgrey;" /></td>
              <td><input type="number" v-bind:name="'product_total_'+i.order_number "  v-bind:value= "i.order_itemprice * i.order_qty " readonly style="background-color: lightgrey;" /></td>
            </tr>
            <tr v-for="m in tot" v-if="m.total_ordernumber===a[0].order_number">
              <td colspan="4" style="text-align: left; padding-right: 20px;font-size: 25px;">FULL TOTAL </td>
              <td ><input type="number" v-bind:name="'total_'+ a[0].order_number" v-bind:value="m.total_orderamount" readonly style="background-color: lightgrey;" /></td>
            </tr>
            <tr v-for="m in tot" v-if="m.total_ordernumber===a[0].order_number">
            <td colspan="5">
                <div  class="rating-wrapper">
                  <input type="radio" v-bind:id="m.total_ordernumber+'_5'" v-bind:name="m.total_ordernumber+'_5'" v-bind:checked="m.total_orderrating == 5" @change="selectedRating(m.total_ordernumber,5)" ><label v-bind:for="m.total_ordernumber+'_5'" ></label>
                  <input type="radio" v-bind:id="m.total_ordernumber+'_4'" v-bind:name="m.total_ordernumber+'_4'" v-bind:checked="m.total_orderrating == 4" @change="selectedRating(m.total_ordernumber,4)" ><label v-bind:for="m.total_ordernumber+'_4'" ></label>
                  <input type="radio" v-bind:id="m.total_ordernumber+'_3'" v-bind:name="m.total_ordernumber+'_3'" v-bind:checked="m.total_orderrating == 3" @change="selectedRating(m.total_ordernumber,3)"><label v-bind:for="m.total_ordernumber+'_3'" ></label>
                  <input type="radio" v-bind:id="m.total_ordernumber+'_2'" v-bind:name="m.total_ordernumber+'_2'" v-bind:checked="m.total_orderrating == 2" @change="selectedRating(m.total_ordernumber,2)"><label v-bind:for="m.total_ordernumber+'_2'" ></label>
                  <input type="radio" v-bind:id="m.total_ordernumber+'_1'" v-bind:name="m.total_ordernumber+'_1'" v-bind:checked="m.total_orderrating == 1" @change="selectedRating(m.total_ordernumber,1)"><label v-bind:for="m.total_ordernumber+'_1'" ></label>
                </div>
                <br>
            </td>
            <br>
            <br>
            </tr>
          </tbody>             
      </table>
    </div>
    <br>
  </div>
  </div>  
  `,
  props:["c","d"],
  data(){
    return{user:"",cart:"",dat:"",ordl:"",tot:"",prod:"",search:""}
  },
  mounted(){
    console.log("order page")
    fetch(`/user/order/history/${this.c}/${this.d}`).then(response=>{return response.json()}).
    then(data=>{
      this.user=data['user']
      this.cart=data['cart']
      this.dat=data['dat'].substring(0,17)
      this.ordl=data['ordl']
      this.tot=data['tot']
      this.prod=data['prod']
      console.log(data)
    }).catch(error=>console.log(error))
  },
  methods:{
    selectedRating(a,b){
      fetch(`/user/order/rating/${a}/${b}/${this.c}`).then(response=>{return response.json()}).
      then(data=>{
        if(data==="rating updated successfully"){
          window.location.reload()
        }
        if(data==="error"){
          alert("Error")
        }
      }
      )
  },
  searchpro(){
    if(this.search==''){alert("please enter text")}
    else{
    this.$router.push(`/user/search/${this.user.id}/${this.search}`)
    window.reload()}
  },
  advancesearch(){
    this.$router.push(`/user/advsearch/${this.user.id}`)
  }
  }


})


export default user_advsearch_order

