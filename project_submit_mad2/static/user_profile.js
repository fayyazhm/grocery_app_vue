const user_profile= Vue.component("user_profile",{
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
  <div class="container" style="border:2px solid black;width:35%;background-color:dimgrey" >
      <div class="form-row" style="margin-right: -75px;margin-left: 10px;">
        <div class="form-group col-md-10">
          <label for="inputEmail4">USERNAME</label>
          <input type="text" class="form-control" id="inputEmail4" placeholder="username" name="username" v-model:value="username_new" style="background-color: lightgrey;">
        </div>
        <br>
      <div class="form-group col-md-10">
        <label for="inputAddress">ADDRESS</label>
        <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St" name="address" v-model:value="address_new" style="background-color: lightgrey;">
      </div>
      <br>
      <div class="form-group col-md-10">
        <label for="inputAddress2">ADDRESS 2</label>
        <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" v-model:value="address2_new" style="background-color: lightgrey;">
      </div>
      <br>
      <div class="form-row">
        <div class="form-group col-md-10">
          <label for="inputCity">CITY</label>
          <input type="text" class="form-control" id="inputCity" name="city" v-model:value="city_new" style="background-color: lightgrey;">
        </div>
        <br>
        <div class="form-group col-md-10">
          <label for="inputState">STATE</label>
          <input type="text" class="form-control" id="inputstate" name="state" v-model:value="state_new" style="background-color: lightgrey;">
        </div>
        <br>
        <div class="form-group col-md-10">
          <label for="inputZip">ZIP</label>
          <input type="text" class="form-control" id="inputZip" name="zip" v-model:value="zip_new" style="background-color: lightgrey;">
        </div>
      </div>
      <br>
      <button v-on:click="user_edit" type="submit" class="btn btn-primary">EDIT</button>
      </div>
  </div>
  </div>
  `,
  props:["c"],
  data(){
    return{ user:"",cart:"",username_new:"",address_new:"",address2_new:"",city_new:"",state_new:"",zip_new:"",dat:"",search:""}
  },
  mounted(){
    fetch(`/user/${this.c}`).then(response=>{return response.json()}).
    then((data)=>{
        console.log(data)
        this.user=data['user']
        this.cart=data['cart']
        this.dat=data["dat"].substring(0,17)
        document.title=`${this.user.username} Profile`
        this.username_new=this.user.username
        this.address_new=this.user.address.toUpperCase()
        this.address2_new=this.user.address2.toUpperCase()
        this.city_new=this.user.city.toUpperCase()
        this.state_new=this.user.state.toUpperCase()
        this.zip_new=this.user.zip

    })
  },
  methods:{
    user_edit(){
        console.log("usereidt")
        const data={username:this.username_new,address:this.address_new,address2:this.address2_new,city:this.city_new,state:this.state_new,zip:this.zip_new}
        fetch(`/user/edit/${this.c}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).then((response)=>{return response.json()}).
        then((data)=>{
            if(data=="profile successfully edited"){
                alert("profile has been updated successfully")
                this.$router.push("/")
                
            }
            if(data=="error"){
                this.$router.push(`/user/already/${this.username_new}/${this.user.id}`)
            }
        })
    },
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

export default user_profile





















