
const admin_authorization=Vue.component("admin_authorization",{
    template:`
    <div> 
    
    <div class="text-center" style="position:relative;top:140px;width: 90%;left: 60px;">
       <h1 style="text-decoration:underline">CATEGORY MODIFICATION/ADDITION REQUESTS </h1> 
       <table class="table">
          <thead style="background-color:dimgrey;">
            <tr>
              <th style="width:53px" scope="col">SL_NO</th>
              <th scope="col">CATEGORY NAME</th>
              <th scope="col">ACTION REQUESTED</th>
              <th scope="col">STORE MANAGER ID</th>
              <th scope="col">STATUS</th>
              <th scope="col">RESPONSE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="category.length==0">
            <th colspan="6">No Requests as of Now</th>
            </tr>
            <tr v-for="(i,index) in category">
              <th style="color:black">{{ index+1 }}</th>
              <th style="color:black">{{ i.category_name }}</th>
              <th style="color:black">{{ i.action }}</th>
              <th style="color:black">{{ i.storemanager_id }}</th>
              <th style="color:black">{{ i.status }}</th>
              <th v-if="i.status==='Pending'" style="color:black">
                    <button v-on:click="authorize(i.action,i.category_id,i.category_name)" class="input-group-append btn btn-success" style="margin-right:20px;color:black" >
                          <i class="bi bi-check">Authorize</i>
                    </button>
                    <button v-on:click="reject(i.action,i.category_id,i.category_name)" class="input-group-append btn btn" style="margin-right:20px;color:black;background-color:indianred" >
                          <i class="bi bi-trash">Reject</i>
                    </button>
              </th>
              <th v-if="i.status==='Completed' || i.status==='Reject'" style="color:black">
                    Already Processed
              </th>
            </tr>
          </tbody>
          </table>
  </div>
  
  <div class="text-center" style="position:relative;top:140px;width: 90%;left: 60px;margin-top:200px">
      <h1 style="text-decoration:underline">STORE MANAGER NEW USER REQUESTS </h1> 
        <table class="table">
          <thead style="background-color:dimgrey;">
            <tr>
              <th style="width:53px" scope="col">SL_NO</th>
              <th scope="col">TEMP USER ID</th>
              <th scope="col">USER NAME</th>
              <th scope="col">STATUS</th>
              <th scope="col">RESPONSE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length==0">
            <th colspan="5">No Requests as of Now</th>
            </tr>
            <tr v-for="(i,index) in users">
              <th style="color:black">{{ index+1 }}</th>
              <th style="color:black">{{ i.temp_id }}</th>
              <th style="color:black">{{ i.username }}</th>
              <th style="color:black">{{ i.status }}</th>
              <th v-if="i.status==='Pending'" style="color:black">
                    <button v-on:click="authorize_user(i.temp_id)" class="input-group-append btn btn-success" style="margin-right:20px;color:black" >
                          <i class="bi bi-check">Authorize</i>
                    </button>
                    <button v-on:click="reject_user(i.temp_id)" class="input-group-append btn btn" style="margin-right:20px;color:black;background-color:indianred" >
                          <i class="bi bi-trash">Reject</i>
                    </button>
              </th>
              <th v-if="i.status==='Completed' || i.status==='Reject'" style="color:black">
                    Already Processed
              </th>
            </tr>
          </tbody>
          </table>
  </div>
  </div>
    `,
  data(){
    return{
        category:"",users:""
    }

  },
  mounted(){
    fetch("/admin/authorization/category").then(response=>{return response.json()}).
    then((data)=>{
        this.category=data["category"]
        this.users=data["users"]
    }).catch(error=>console.log(error))
  },
  methods:{
    authorize(a,b,c){
      if(a==="Add"){
        const data={category_name:c}
        fetch("/add_categories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),}).
        then(response=>response.json()).
        then(
        data=>{
          if (data==="category already present"){
            alert("category already present")
            this.reject(a,b,c)
          }
          if(data==="category successfully added"){
            fetch(`/store/category/update/${c}/${b}`).then(response=>{return response.json()}).
            then(data=>{
              if(data=="success"){
                window.location.reload()
              }
            })
          }
        }
      ).catch(error=>console.log("error:",error))
      }

      if(a=="Delete"){
        fetch(`/category/delete/${b}`).
        then(response=>response.json()).
        then(
        data=>{
          if(data==="category successfully deleted"){
            fetch(`/store/category/update/${c}/${b}`).then(response=>{return response.json()}).
            then(data=>{
              if(data=="success"){
                window.location.reload()
              }
            })
          }
          if(data==="error"){
            alert("error")
          }
        }
      ).catch(error=>console.log("error:",error))
      }


      if(a=="Edit"){
        const data={category_name:c,category_id:b}
        fetch("/edit_categories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),}).
        then(response=>response.json()).
        then(
        data=>{
          if (data==="category already present"){
            console.log(data)
            this.$router.push('/category_already/'+this.new_name.toUpperCase())
          }
          if(data==="category already present"){
            console.log(data)
          }
          if(data==="category successfully added"){
            console.log("success")
            fetch(`/store/category/update/${c}/${b}`).then(response=>{return response.json()}).
            then(data=>{
              if(data=="success"){
                window.location.reload()
              }
            })
          }
        }
      ).catch(error=>console.log("error:",error))
      }
    },
    reject(a,b,c){
      fetch(`/store/category/reject/${c}/${b}`).then(response=>{return response.json()}).
            then(data=>{
              if(data=="success"){
                window.location.reload()
              }
            })
    },
    authorize_user(a){
      fetch(`/user/add/${a}`).then(response=>{return response.json()}).
      then(data=>{
        if(data=="success"){
          fetch(`/user/update/${a}`).then(response=>{return response.json()}).
          then(data=>{
            if(data=="success"){
              window.location.reload()
            }
            if(data=="error"){
              alert("user already present with the same username")
            }
          })
        }
        if(data=="error"){
          alert("user already present with the same username")
        }
      })
    },
    reject_user(a){
      fetch(`/user/update/${a}`).then(response=>{return response.json()}).
      then(data=>{
        if(data=="success"){
          window.location.reload()
        }
        if(data=="error"){
          alert("error")
        }
      })
    }
  }
    
})


export default admin_authorization