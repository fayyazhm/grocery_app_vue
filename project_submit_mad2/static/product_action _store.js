function convertDateToYYYYMMDD(dateString) {
    const months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
  
   
    const parts = dateString.split(' ');
  
   
    const year = parts[3];
    const month = months[parts[2]];
    const day = parts[1];
  
  
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }



const product_action_store=Vue.component("product_edit_store",{
    template:`
    <div class="text-center" style="position: relative;top: 60px;width: 60%;left: 300px;">
    <div class="row" style="background-color: steelblue;" >
      <div>
      </div>
      <div style='border:2px solid black'class="col">
          <div style='position:relative;top:10px;left:-41px'>
            <label> CATEGORY NAME:</label>
            <input type="text" name="category_name" v-model:value="category.category_name" disabled />
          </div>
          <br>
          <div style='position:relative;top:10px;left:-39px'>
            <label> PRODUCT NAME:</label>
            <input type="text" name="product_name" v-model:value= 'product_name_new' style="background-color: darkgrey;" required />
          </div>
          <br>
          <div style='position:relative;top:10px;left:-40px'>
            <label>MANUFACTURER:</label>
            <input type="text" name="product_manufacture" v-model:value="product_manufacture_new" style="background-color: darkgrey;" required />
          </div>
          <br>
          <div style='position:relative;top:10px;left:-81px'>
            <label>EXPIRY DATE:</label>
            <input type="date" name="product_expirydate" v-model:value="product_expirydate_new" style="background-color: darkgrey;" required/>
          </div>
          <br>
          <div style='position:relative;top:10px;left:3px'>
            <label>RATE:</label>
            <input type="number" name="product_rate" v-model:value= 'product_rate_new' style="background-color: darkgrey;" required />
          </div>
          <br>
          <div style='position:relative;top:10px;left:-55px'>
            <label>PRODUCT QUANTITY:</label>
            <input type="number" name="product_quantity" v-model:value= 'product_quantity_new' style="background-color: darkgrey;" required />
          </div>
          <br>
          <div>
            <input v-on:click="editproduct" type="submit" class="btn btn-success" value = "EDIT THE PRODUCT">
            <router-link :to="'/store/product/delete/conf/' + c"> <a class="btn btn-success">DELETE PRODUCT</a></router-link>
          </div>
          <br>
      </div>
      <div>
      </div>
    </div>
  </div>`,
  props:["c"],
  data(){
    return{product:"",category:"",product_name_new:"",product_manufacture_new:"",product_expirydate_new:"",product_rate_new:"",product_quantity_new:""}
  },
  beforeMount() {
    console.log("mounted");
    fetch("/categories")
      .then((response) => response.json())
      .then((data) => {
        { console.log("edit",data); 
          for(const i of data.prod){
            console.log("i",i)
            if(i.product_id==this.c){
               this.product=i;
               this.product_name_new=i.product_name;
               this.product_manufacture_new=i.product_manufacture;
               const formattedDate = convertDateToYYYYMMDD(i.product_expirydate);
               this.product_expirydate_new=formattedDate
               console.log(i.product_expirydate)
               console.log(this.product_expirydate_new)
               this.product_rate_new=i.product_rate;
               this.product_quantity_new=i.product_quantity;
               console.log(this.product)
               break;
            }
            }
          }  
          for(const b of data.cat){
            if(b.category_id==this.product.product_category){
              this.category=b;
              break;
            }
          }
        })
      },
    methods:{
      editproduct(){
        if (!this.product_name_new || !this.product_manufacture_new || !this.product_expirydate_new || !this.product_rate_new || !this.product_quantity_new) {
          alert('Please fill in all required fields.');
          return; 
        }
          const data={product_name:this.product_name_new,product_manufacture:this.product_manufacture_new,product_expirydate:this.product_expirydate_new,product_rate:this.product_rate_new,
          product_quantity:this.product_quantity_new,product_id:this.product.product_id}
          fetch("/edit_product",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).
          then(response=>{return response.json()}).
          then(
          data=>{
            if (data=="product already present"){
              console.log(data)
              this.$router.push('/category_already/'+this.product_name_new.toUpperCase())
            }
            if(data=="product successfully edited"){
              console.log(data)
              this.$router.push('/')
            }
          }
        ).catch(error=>console.log("error:",error))
      }
  
    }
    });

    export default product_action_store