const category_edit_store=Vue.component("category_edit_store",{
    template:`  
    <div class="text-center" style="position: relative;top: 30px;width: 50%;left: 430px;">
    <div class="row" style="background-color:steelblue ;">
      <div>
      </div>
      <div style='border:2px solid black'class="col">
          <h1>CATEGORY EDIT</h1>
          <br>
          <div style='position:relative;top:10px;left:-25px'>
            <label> CATEGORY NAME:</label>
            <input type="text" name="category_name" v-model="new_name" style="background-color: darkgrey;" required />
          </div>
          <br>
          <div>
            <button v-on:click="editcat" type="submit" class="btn btn-primary">UPDATE</button>
          </div>
          <br>
      </div>
    </div>
  </div>`,
  props:["c"],
  data(){
    return{category:"",new_name:""}
  },
  mounted(){
    fetch(`/category/${this.c}`)
        .then((response) => {
          return response.json()})
        .then((data) => {
          this.category = data;
          this.new_name=this.category.category_name
          console.log("how",data)
          console.log(this.category)
        })
        .catch(error=>console.log(error));
  },
  methods:{
    editcat(){
      const data={category_name:this.new_name,category_id:this.category.category_id,action:"Edit"}
      fetch("/store/edit_categories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),}).
      then(response=>response.json()).
      then(
      data=>{
        if (data==="category name already present"){
          alert("another category with the same name already present for edit try different name")
        }
        if(data==="category successfully added"){
          console.log(data)
          this.$router.push('/')
        }
        if(data=="category already requested for delete"){
          alert("category already requested for delete")
        }
      }
    ).catch(error=>console.log("error:",error))
    }
  }
  })
  
  export default category_edit_store