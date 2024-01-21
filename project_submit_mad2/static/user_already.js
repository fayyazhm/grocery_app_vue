const user_already=Vue.component("user_already",{
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
    <h1 style="font-size:30px;">{{ this.c }} already exists try a different username</h1>
    </div>  
    `,
    props:['c','d'],
    data(){
        return{ user:"",cart:"",dat:"",search:""}
      },
    mounted(){
        
        fetch(`/user/${this.d}`).then(response=>{return response.json()}).
        then((data)=>{
            console.log(data)
            this.user=data['user']
            this.cart=data['cart']
            this.dat=data["dat"].substring(0,17)
            document.title=`${this.user.username} Profile`
             
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

export default user_already