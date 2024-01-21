const category_summary=Vue.component("category_summary",{
    template:`
    <div class="text-center" style="position:relative;top:140px;width: 90%;left: 60px;">
    <table class="table">
      <thead style="background-color:dimgrey;">
        <tr>
          <th style="width:53px" scope="col">SL_NO</th>
          <th scope="col">CATEGORY NAME</th>
          <th scope="col">CATEGORY WISE PRODUCT TYPES</th>
          <th scope="col">CATEGORY WISE PRODUCT PURCHASED</th>
          <th scope="col">CATEGORY WISE PRODUCT AVAILABLE</th>
        </tr>
      </thead>  
      <tbody>
        <tr v-for="(i,index) in cat" >
          <td v-if="proda[i.category_id]==0" style="color:red" >{{ index+1 }}</td>
          <td v-if="proda[i.category_id]>0" style="color:black" > {{ index+1 }}</td>
          <th v-if="proda[i.category_id]==0"><router-link :to="'/admin/summary/category/'+ i.category_id" style="text-decoration: none;color:RED"> {{ i.category_name.toUpperCase() }}</router-link></th>
          <th v-if="proda[i.category_id]>0"><router-link :to="'/admin/summary/category/'+ i.category_id" style="text-decoration: none;color:black"> {{ i.category_name.toUpperCase() }}</router-link></th>
          <td v-if="proda[i.category_id]==0" style="color:red" >{{ prodl[i.category_id].length }}</td>
          <td v-if="proda[i.category_id]>0" style="color:black" >{{ prodl[i.category_id].length }}</td>
          <td v-if="proda[i.category_id]==0" style="color:red" >{{ totl[i.category_id] }}</td>
          <td v-if="proda[i.category_id]>0" style="color:black" >{{ totl[i.category_id] }}</td>
          <td v-if="proda[i.category_id]==0" style="color:red">{{ proda[i.category_id] }}</td>
          <td v-if="proda[i.category_id]>0" style="color:black">{{ proda[i.category_id] }}</td>
        </tr>
      </tbody>
  </table>
</div>`,
data(){
  return{catl:"",prodl:"",cat:"",totl:"",proda:""}
},
mounted(){
fetch("/admin/summary/category").then((response)=>{return response.json()}).
then(data=>{
  this.catl=data["catl"]
  this.prodl=data['prodl']
  this.cat=data["cat"]
  this.totl=data["totl"]
  this.proda=data["proda"]
})
}
})

export default category_summary