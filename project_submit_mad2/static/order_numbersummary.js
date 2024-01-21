
const order_numbersummary=Vue.component("order_numbersummary",{
    template:`
    <div class="text-center" style="position:relative;top:140px;width: 90%;left: 60px;">
    <div style="display: flex; justify-content: space-between;">
      <h1 style="text-align: left;font-size: 30px;">Order Number # {{ tot.total_ordernumber }}</h1>
      <h1 style="text-align: center;font-size: 30px;">User Name:{{ nam.toUpperCase() }}</h1>
      <h1 style="text-align: right;font-size: 30px;">Order Date:{{ convertDateToYYYYMMDD(tot.total_orderdate) }}</h1>
    </div>
    <table class="table">
      <thead style="background-color:dimgrey;">
        <tr>
          <th style="width:53px" scope="col">SL_NO</th>
          <th scope="col">PRODUCT NAME</th>
          <th scope="col">PRODUCT PRICE</th>
          <th scope="col">PRODUCT QTY</th>
          <th scope="col">PRODUCT TOTAL</th>
        </tr>
      </thead>
        <tbody>
        <tr v-for="i in ord">
          <td>{{ i.order_itemnumber  }}</td>
          <td v-for="c in prod" v-if="i.order_productid==c.product_id" >{{ c.product_name.toUpperCase() }}</td>
          <td>{{ i.order_itemprice  }}</td>
          <td>{{ i.order_qty }}</td>
          <td>{{ i.order_qty  * i.order_itemprice }}</td>
        </tr>
        </tbody>
        <tr>
          <td colspan="4" style="text-align: left; padding-right: 20px;font-size: 25px;">FULL TOTAL</td>
          <td>{{ tot.total_orderamount }}</td>
        </tr>
        <tr>
          <td colspan="5">
            <div style="display: flex; justify-content: center;">
              <p style="font-size: 25px">USER RATING:</p>
              <div class="rating-wrapper" style="justify-content: center;">
                <input type="radio" id="5" name="5" v-if="tot.total_orderrating == 5" checked disabled ><label for ="5"></label>
                <input type="radio" id="4" name="4" v-if="tot.total_orderrating == 4" checked disabled><label for ="4"></label>
                <input type="radio" id="3" name="3" v-if="tot.total_orderrating == 3" checked disabled><label for ="3"></label>
                <input type="radio" id="2" name="2" v-if="tot.total_orderrating == 2" checked disabled><label for ="2"></label>
                <input type="radio" id="1" name="1" v-if="tot.total_orderrating == 1" checked disabled><label for ="1"></label>
              </div>
            </div>
          </td>
        </tr>
    </table>
  </div>`,
  props:["c"],
  data(){
    return{
        tot:"",ord:"",prod:"",nam:""
    }
  },
  mounted(){
    fetch(`/admin/order/${this.c}`).then((response)=>{return response.json()}).
    then((data)=>{
        this.tot=data["tot"]
        this.ord=data["ord"]
        this.prod=data["prod"]
        this.nam=data["nam"]
    })
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

export default order_numbersummary