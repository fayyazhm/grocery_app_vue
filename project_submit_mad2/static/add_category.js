const add_category=Vue.component("category_add",{
    template:`  
    <div class="text-center" style="position: relative;top: 30px;width: 50%;left: 430px;">
    <div class="row" style="background-color: steelblue;">
      <div>
      </div>
      <div style='border:2px solid black'class="col">
          <h1> CATEGORY ADD DETAILS</h1>
          <div style='position:relative;top:10px;left:-25px'>
            <label> CATEGORY NAME:</label>
            <input v-model="category_name"  type="text" name="category_name" style="background-color: darkgrey;" required />
          </div>
          <br>
          <div>
            <button type="submit"  v-on:click="submitform" class="btn btn-primary">SUBMIT</button>
          </div>
          <br>  
      </div>
    </div>
    </div>`
  ,
  data(){
    return{
      category_name:"",
    }
  },
  methods:{
    submitform(){
      const data={category_name:this.category_name}
      fetch("/add_categories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),}).
      then(response=>response.json()).
      then(
      data=>{
        if (data==="category already present"){
          console.log(data)
          this.$router.push('/category_already/'+this.category_name.toUpperCase())
        }
        if(data==="category successfully added"){
          console.log(data)
          this.$router.push('/')
        }
      }
    ).catch(error=>console.log("error:",error))
    }
  }
}
)

export default add_category