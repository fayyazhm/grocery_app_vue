const add_product=Vue.component("product_add",{
    template:`  
    <div class="text-center" style="position: relative;top: 60px;width: 60%;left: 300px;">
    <div class="row" style="background-color: steelblue;">
      <div>
      </div>
      <div style='border:2px solid black'class="col">
          <div style='position:relative;top:10px;left:-41px'>
            <label> CATEGORY NAME:</label>
            <input  type="text" name="category_name" v-bind:placeholder="category.category_name" disabled />
          </div>
          <br>
          <div style='position:relative;top:10px;left:-39px'>
            <label> PRODUCT NAME:</label>
            <input v-model="product_name" type="text" name="product_name" style="background-color: darkgrey;" required />
          </div>
          <br>
          <div style='position:relative;top:10px;left:-40px'>
            <label>MANUFACTURER:</label>
            <input v-model="product_manufacture" type="text" name="product_manufacture" style="background-color: darkgrey;" required />
          </div>
          <br>
          <div style='position:relative;top:10px;left:-81px'>
            <label>EXPIRY DATE:</label>
            <input v-model="product_expirydate" type="date" name="product_expirydate" style="background-color: darkgrey;" required />
          </div>
          <br>
          <div style='position:relative;top:10px;left:3px'>
            <label>RATE:</label>
            <input v-model="product_rate" type="number" name="product_rate" style="background-color: darkgrey;" required />
          </div>
          <br>
          <div style='position:relative;top:10px;left:-55px'>
            <label>PRODUCT QUANTITY:</label>
            <input v-model="product_quantity" type="number" name="product_quantity" style="background-color: darkgrey;" required />
          </div>
          <br>
          <div>
            <button v-on:click="addproducts" type="submit" class="btn btn-primary">SUBMIT</button>
          </div>
          <br>
      </div>
    </div>
  </div>`,
  props:['c'],
  data(){
    return{category:"",product_name:"",product_manufacture:"",product_expirydate:"",product_rate:"",product_quantity:""
          }
  },
  mounted(){
    console.log("inside add")
    fetch(`/category/${this.c}`)
        .then((response) => {
          return response.json()})
        .then((data) => {
          this.category = data;
          console.log("how",data)
        })
        .catch(error=>console.log(error));
  },
  methods:{
    addproducts(){
      const data={product_name:this.product_name,product_manufacture:this.product_manufacture,product_expirydate:this.product_expirydate,product_rate:this.product_rate,
        product_quantity:this.product_quantity,product_category:this.c}
      fetch("/add_product",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).
      then(response=>{return response.json()}).
      then(
      data=>{
        if (data=="product already present"){
          console.log(data)
          this.$router.push('/category_already/'+this.product_name.toUpperCase())
        }
        if(data=="product successfully added"){
          console.log(data)
          this.$router.push('/')
        }
      }
    ).catch(error=>console.log("error:",error))
    }
  }
  })

  export default add_product