console.log("hello")

const categ_store = Vue.component("category_present_store", {
    template: `
    <div>
  <br>
  <br>
  <router-link to="/store/category" style="color:black;text-decoration: none"><a style='display: inline-block;position:relative;left:890px;top:35px;text-decoration: none;'>
  <button class="button" style="display: flex; justify-content: center; align-items: center;color:black">ADD CATEGORY + </button></a></router-link>
<br>
<br>
  <h2 v-if="categories.length==0"> NO PRODUCT OR CATEGORIES AVAILABLE</h2>
  <div class="container-text-center" style="margin:50px">
  <div class="row row-cols-3">
  <div v-for="c in categories" :key="c.category_id" class="col">
    <div id="rcorners1">
    <div>
    <div class="button-container">
    <router-link :to="'/store/product/'+c.category_id" style="text-decoration:none" ><a><button class="button" style="display: flex; justify-content: center; align-items: center;color:black;">ADD PRODUCT + {{ c.category_name.toUpperCase() }}</button></a></router-link>
        <div class="button-group">
        <router-link :to="'/store/category/edit/'+c.category_id" style="color:black;text-decoration: none"><button class="input-group-append btn" style="margin-right:20px;background-color:lightgrey" >
        <i class="bi bi-pen">Edit</i></button></router-link>
        <router-link :to="'/store/category/delete/confirm/'+ c.category_id" style="color:black;text-decoration: none"><button class="input-group-append btn" style="margin-right:20px;background-color:indianred" >
        <i class="bi bi-trash">Delete</i></button></router-link>
        </div>
        <br>
    </div>
        <div v-for="i in prod" v-if="i.product_category==c.category_id" id="rcorners2">
          <p style="color:black;font-weight: bold;">Name:{{ i.product_name.toUpperCase() }}</p>
          <p style="color:black;font-weight: bold">Available Qty:{{ i.product_quantity}}</p>
          <p style="color:black;font-weight: bold">Price:Rs.{{ i.product_rate}}/qty</p>
          <router-link :to="'/store/product/edit/' + i.product_id " style="color:black;text-decoration: none"><a v-if="i.product_quantity>0"style="text-decoration:none"><button type="button" class="btn btn-success" style="color:black;display:flex;justify-content:flex-end;align-items:center" >ACTION</button></a></router-link>
          <router-link :to="'/store/product/edit/' + i.product_id " style="color:black;text-decoration: none"><a v-if="i.product_quantity<=0"style="text-decoration:none"><button type="button" class="btn btn-success" style="color:black;--bs-btn-bg: red;--bs-btn-hover-bg: darkred;display:flex;justify-content:flex-end;align-items:center">ACTION</button></a></router-link>  
        </div>
        <br>
      </div>
    </div>
    <br>
    <br>
  </div> 
  </div>
  </div>
  </div>
    `,
    data() {
      return {
        categories: [],
        prod: [],
      };
    },
    mounted() {
      console.log("mounted");
      document.title = "Grocery-app";
      fetch("/categories")
        .then((response) => response.json())
        .then((data) => {
          this.categories = data.cat;
          this.prod = data.prod;
        });
    },
  
    }
  );
  
  export default categ_store