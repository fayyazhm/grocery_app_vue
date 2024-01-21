const user_advance_search=Vue.component('user_search',{
    template:`<div>
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
            </div>
          <li class="nav-item">
            <a href="/logout" class="nav-link">LOGOUT</a>
          </li>
        </li>
      </ul>
    </div>
    <p style="font-size:30px;text-align:end;margin-right: 50px;">DATE : {{ dat }} </p>
    <br>
    <div class="container" style="margin-top:300px;margin-left:500px">
    <label for="search" style="font-size:23px">SEARCH</label>
    <input type="text" id="search" name="search" v-model="val" style="height:40px"  required>
        <select name="criteria" id="criteraiaaaa" v-model="opt" style="height:40px" @change="place(opt)">
        <option selected>CRITERIA FOR SEARCH</option>
        <option value="product" name="product">PRODUCT</option>
        <option value="category" name="category">CATEGORY</option>
        <option value="order" name="order">ORDER</option>
        <option value="price_less" name="price_less">LESS THAN OR EQUAL TO PRICE</option>
        <option value="price_more" name="price_more">MORE THAN OR EQUAL TO PRICE</option>
        <option value="expiry_date" name="expiry_date">EXPIRY DATE</option>
        </select>
        <button type="submit" v-on:click="sub" class="btn btn-primary">SUBMIT</button>
    </div>
    </div>
    `,
    props:["c"],
    data(){
        return{ user:"", cat:"",prod:"",cart:"",dat:"",search:"",val:"",opt:"CRITERIA FOR SEARCH" }
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
            document.title= `Advance Search ${this.user.username.toUpperCase()}`
        }
        )
    },
    methods:{
        searchpro(){
          if(this.search==''){alert("please enter text")}
          else{
          this.$router.push(`/user/search/${this.user.id}/${this.search}`)
          window.location.reload()}
        },
        sub(){
            if(this.opt=="CRITERIA FOR SEARCH"){
              alert("please select valid search criteria")
            }
            if(this.opt=="price_less" || this.opt=="price_more"){
              if(isNaN(parseInt(this.val))){
                alert("please enter valid Number")
              }
              else{
                this.$router.push(`/user/advsearch/${this.user.id}/${this.opt}/${this.val}`)
              }
            }
            else if(this.val==""){alert("please enter text")}
            else if(!(this.opt=="order")){
            console.log("inside")
            this.$router.push(`/user/advsearch/${this.user.id}/${this.opt}/${this.val}`)}
            else if(this.opt=="order"){
              console.log("outside")
              this.$router.push(`/user/order/advsearch/${this.user.id}/${this.val}`)
            }
        },
        place(a){

          if(a=="expiry_date"){
            document.getElementById("search").placeholder="DD-MM-YYYY"
            document.getElementById("search").type="date"
          }
          else{
            document.getElementById("search").placeholder=""
            document.getElementById("search").type=""
          }
          
        }
        
   
}
})

export default user_advance_search