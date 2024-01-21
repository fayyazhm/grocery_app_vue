const user_product_search= Vue.component("user_product_search",{
    template:`
    <div>
    <div style='border:2px solid black;background-color:darkgrey;' class="d-flex justify-content-between">
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
    <h1 v-if="cat.length==0">No Items Available</h1>
    <div v-for="c in cat" class="container text-center">
    <div class="row row-cols-5" id="rcorners1">
      <div class="col"></div>
      <div class="col"></div>
      <div class="col" style="font-size: 24px;text-decoration: underline;">
      {{ c.category_name.toUpperCase() }}
      </div>
      <div class="col"></div>
      <div class="col"></div>
      <div v-for="i in prod" v-if="c.category_id==i.product_category" class="col">
          <div id="rcorners2"> 
          <span>{{ i.product_name.toUpperCase() }}</span>
          <br>
          Rs.<span>{{ i.product_rate }}</span>/qty
          <div class="input-group">
            <span class="input-group-prepend" >
                <button v-on:click="decrease(i.product_id)" style="background-color: mediumaquamarine;" class="btn btn-outline-secondary" type="button">-</button>
            </span>
            <input type="text" class="form-control text-center" v-bind:id="'input_'+i.product_id" v-model:value="cart_productqty[i.product_id]" style="background-color: lightgray;">
              <span class="input-group-append" >
                <button v-on:click="increase(i.product_id)" style="background-color: mediumaquamarine;" class="btn btn-outline-secondary" type="button">+</button>
              </span>
          </div>
          <button type="button" v-on:click="addcart(i.product_id)" class="btn btn-success green-button" style="--bs-btn-bg: mediumseagreen" >ADD TO CART</button>	
      </div>
      <br>
      </div>   
    </div>
    <br>
  </div>
  </div>  
    `,
    props:['c','d'],
    data(){
        return{ user:"", cat:"",prod:"",cart:"",dat:"",search:"",cart_productqty:""}
    },
    mounted(){
        
        fetch(`/user/search/${this.c}/${this.d}`).then((response)=>{return response.json()}).
        then((data)=>
        {
            this.user=data["user"]
            this.cat=data["cat"]
            this.prod=data["prod"]
            this.cart=data["cart"]
            this.dat=data["date"].substring(0,17)
            document.title= `Home Page ${this.user.username.toUpperCase()}`
            this.cart_productqty=data["cart_productqty"]
        }
        )
    },
    methods:{
      searchpro(){
        if(this.search==''){alert("please enter text")}
        else{
        this.$router.push(`/user/search/${this.user.id}/${this.search}`);
        window.location.reload()
      }
      },
      advancesearch(){
        this.$router.push(`/user/advsearch/${this.user.id}`)
      },
      increase(a){
        var available;
        for(const i of this.prod){
          if(i.product_id==a){
              available=i.product_quantity
          }
        }
        var b=document.getElementById(`input_${a}`)
        if(b.value < available ){
        b.value=parseInt(b.value)+1
        }
        else{
          alert("maximum available qty reached")
        }
      },
      decrease(a){
        var b=document.getElementById(`input_${a}`)
        if(b.value==0){
          alert("cannot reduce further")
        }
        else{b.value=parseInt(b.value)-1}
      },
      addcart(a){
        var b=document.getElementById(`input_${a}`).value
        if(b==0){
          alert("please provide valid cart add qty")
        }
        else{
        fetch(`/user/cart/${this.user.id}/${a}/${b}`).then((response)=>{return response.json()}).
        then((data)=>{
          if(data=="cart added successfully"){
            window.location.reload()
          }
          if(data=="error"){
            alert("The requested quantity is currently not available")
          }
        })}
      }
    }

})

export default user_product_search