
const store_requests=Vue.component("admin_authorization",{
    template:` 
    <div class="text-center" style="position:relative;top:140px;width: 95%;left: 60px;">
      <h1 style="text-decoration:underline">CATEGORY MODIFICATION REQUESTS</h1>
        <table class="table">
          <thead style="background-color:dimgrey;">
            <tr>
              <th style="width: 10px" scope="col">SL_NO</th>
              <th style="width: 50px" scope="col">CATEGORY NAME</th>
              <th style="width: 50px" scope="col">ACTION REQUESTED</th>
              <th scope="col"style="width: 300px">STORE MANAGER ID</th>
              <th scope="col"style="width: 300px">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="category.length==0">
              <th colspan="5">No Requests As Of Now</th>
            </tr>
            <tr v-for="(i,index) in category">
              <th style="color:black">{{ index+1 }}</th>
              <th style="color:black">{{ i.category_name }}</th>
              <th style="color:black">{{ i.action }}</th>
              <th style="color:black">{{ i.storemanager_id }}</th>
              <th style="color:black">{{ i.status }}</th>
            </tr>
          </tbody>
          </table>
          <br>
          <br>
          <div>
          <button v-on:click="product" class="btn btn-primary">
              <i class="bi bi-download"></i> EXPORT PRODUCTS CSV FILE
          </button>
          <button v-on:click="upload" class="btn btn-primary" style="margin-left:70px">
               <i class="bi bi-upload"></i> ADD PRODUCTS BY CSV FILE
          </button>
          <input type="file" id="file1" ref="fileInput" style="display: none" @change="handleFileUpload">
          </div>
          <br>
          <br> 
          <h1 style="text-decoration:underline">ADD PRODUCTS FILE UPLOAD FAILED DETAILS</h1>
          <table class="table">
            <thead style="background-color:dimgrey;">
              <tr>
                <th style="width: 10px" scope="col">Sl_No</th>
                <th style="width: 50px" scope="col">Upload Date</th>
                <th style="width: 50px" scope="col">File Name</th>
                <th scope="col"style="width: 300px">CATEGORY ABSENT</th>
                <th scope="col"style="width: 300px">PRODUCT ALREADY</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i,index) in tasks">
                <td>{{ index+1 }}</td>
                <td>{{ i.date }}</td>
                <td>{{ i.file_name }}</td>
                <td style="text-align:justify"><p v-for="(c,j) in i['category_absent']" style="margin-bottom:40px">{{ j+1 }}. {{ c }}</p></td>
                <td style="text-align:justify"><p v-for="(d,p) in i['product_already']" style="margin-bottom:40px">{{ p+1 }}. {{ d }}</p></td>
              </tr>
            </tbody>
            </table>
            <br>
            <br>
  </div>`,
  data(){
    return{
        category:"", tasks:""
    }

  },
  mounted(){
    fetch("/admin/authorization/category").then(response=>{return response.json()}).
    then((data)=>{
        this.category=data["category"]
        
    }).catch(error=>console.log(error))

    fetch(`/store/task`).then(response=>{return response.json()}).then(
      data=>{
        this.tasks=data["tasks"]
        console.log(this.tasks)
      }
    )
  },
  methods:{
    product(){
      alert("item started to download")
      fetch("/store/csv/products").then(response=>{return response.json()}).
      then(data=>{
        let h=setInterval(() =>fetch(`/store/csv/${data.id}`).then(response=>{return response.json()}).then(data=>{
          if(data.status=="SUCCESS"){
          console.log("success",data.status)
          clearInterval(h)
          window.location.href="/download/csv"
          alert("item downloaded")
        }
        else{
          console.log("running",data.id,data.status)
        } 
        }), 1000);
      })
    },
    upload(){
      document.getElementById("file1").click();
    },
    handleFileUpload(event){
      const file=event.target.files[0]
      const formd=new FormData()
      formd.append('csv_file',file)
      
      fetch("/upload",{method:"POST",body:formd}).then(response=>{return response.json()}).
      then(data=>
        {
          if(data=="file uploaded successfully"){
            alert("file uploaded success")
            window.location.reload()
        }
          else{alert("error")}
        }
        ).catch(error=>alert("error in network"))
    }


  }
    
})


export default store_requests