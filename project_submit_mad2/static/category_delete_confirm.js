

const category_delete_confirm= Vue.component("category_deleteconfirm",{
    template:`  
    <div class="text-center" style="position: relative;top: 30px;width: 50%;left: 430px;">
    <div class="row" style="background-color:steelblue ;">
      <div>
      </div>
      <div style='border:2px solid black'class="col">
          <h1>CATEGORY DELETE CONFIRM</h1>
          <br>
          <div style='position:relative;top:10px;left:-25px'>
            <label> CATEGORY NAME:</label>
            <input type="text" v-bind:value="category.category_name" name="category_name" style="background-color: darkgrey;" readonly />
          </div>
          <br>
          <div>
            <button v-on:click="deleteconfirm" type="submit" class="btn btn-primary">CONFIRM DELETE</button>
          </div>
          <br>
      </div>
    </div>
  </div>`,
  data(){
    return{
      category:""
    }
  },
  props:["c"],
  mounted(){
    fetch(`/category/${this.c}`)
        .then((response) => {
          return response.json()})
        .then((data) => {
          this.category = data;
          
          console.log("how",data)
          console.log(this.category)
        })
        .catch(error=>console.log(error));
  },
  methods:{
    deleteconfirm(){
      fetch(`/category/delete/${this.category.category_id}`).
      then(response=>response.json()).
      then(
      data=>{
        if(data==="category successfully deleted"){
          console.log(data)
          this.$router.push('/')
        }
        if(data==="error"){
          this.$router.push("/")
          console.log(error)
        }
      }
    ).catch(error=>console.log("error:",error))
    }
  }
  })
  
  export default category_delete_confirm;