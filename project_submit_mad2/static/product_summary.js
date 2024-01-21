
const product_summary=Vue.component("product_summary",{
    template:` 
    <div class="text-center" style="position:relative;top:140px;width: 90%;left: 60px;">
        <table class="table">
          <thead style="background-color:dimgrey;">
            <tr>
              <th style="width:53px" scope="col">SL_NO</th>
              <th scope="col">PRODUCT NAME</th>
              <th scope="col">PRICE</th>
              <th scope="col">EXPIRY DATE</th>
              <th scope="col">MANUFACTURE NAME</th>
              <th scope="col">PURCHASED QTY</th>
              <th scope="col">AVAILABLE QTY</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="(i,index) in product">
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) < convertDateToYYYYMMDD(dat) " style="color:red">{{ index+1 }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) > convertDateToYYYYMMDD(dat) " style="color:black">{{ index+1 }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) < convertDateToYYYYMMDD(dat) " style="color:red">{{ i.product_name.toUpperCase() }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) > convertDateToYYYYMMDD(dat) " style="color:black">{{ i.product_name.toUpperCase() }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) < convertDateToYYYYMMDD(dat) " style="color:red">{{ i.product_rate }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) > convertDateToYYYYMMDD(dat) " style="color:black">{{ i.product_rate }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) < convertDateToYYYYMMDD(dat) " style="color:red">{{ convertDateToYYYYMMDD(i.product_expirydate) }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) > convertDateToYYYYMMDD(dat) " style="color:black">{{ convertDateToYYYYMMDD(i.product_expirydate) }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) < convertDateToYYYYMMDD(dat) " style="color:red">{{ i.product_manufacture.toUpperCase() }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) > convertDateToYYYYMMDD(dat) " style="color:black">{{ i.product_manufacture.toUpperCase() }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) < convertDateToYYYYMMDD(dat) " style="color:red">{{ ordl[i.product_id] }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) > convertDateToYYYYMMDD(dat) " style="color:black">{{ ordl[i.product_id] }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) < convertDateToYYYYMMDD(dat) " style="color:red">{{ i.product_quantity }}</th>
              <th v-if="convertDateToYYYYMMDD(i.product_expirydate) > convertDateToYYYYMMDD(dat) " style="color:black">{{ i.product_quantity }}</th>
            </tr>
            <tr>
              <th colspan="5">Total</th>
              <th>{{ total_pqty }}</th>
              <th>{{ total_aqty }}</th>
            </tr>
            <tr>
              <th style="border:none" colspan="7">THE ROWS COLOURED IN RED HAVE CROSSED THE EXPIRY DATE IF ANY</th>
            </tr>
          </tbody>
          </table>
  </div>`,
  data(){
    return{
        product:"",ordl:"",total_pqty:"",total_aqty:"",dat:""
    }

  },
  mounted(){
    fetch("/admin/summary/product").then(response=>{return response.json()}).
    then((data)=>{
        this.product=data["product"];
        this.ordl=data["ordl"];
        this.total_pqty=data["total_pqty"]
        this.total_aqty=data["total_aqty"]
        this.dat=data["dat"]
        console.log(this.dat)
    }).catch(error=>console.log(error))
  },
  methods:{
     convertDateToYYYYMMDD(dateString) {
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
  }
})


export default product_summary