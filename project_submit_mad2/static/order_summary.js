const order_summary= Vue.component("order_summary",{
  template:`
  <div class="text-center" style="position:relative;top:140px;width: 90%;left: 60px;">
  <table class="table">
    <thead style="background-color:dimgrey;">
      <tr>
        <th style="width: 200px" scope="col">ORDER NUMBER</th>
        <th style="width: 200px"scope="col">DATE</th>
        <th scope="col"style="width: 300px">USER NAME</th>
        <th style="width: 200px"scope="col">PURCHASE AMOUNT</th>
        <th style="width: 200px"scope="col">USER RATING</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in tot">
        <th><router-link :to="'/admin/order/' + i.total_ordernumber " style="color:black" >{{ i.total_ordernumber }}</router-link></th>
        <td>{{ convertDateToYYYYMMDD(i.total_orderdate) }}</td>
        <td>{{ name[i.total_ordernumber] }}</td>
        <td>{{ i.total_orderamount }}</td>
        <td>{{ i.total_orderrating }}</td>  
      </tr>
    </tbody>
    </table>
</div>`,
data(){
    return{ tot:"",name:"" }
},
mounted(){
    fetch("/admin/summary/order").then((response)=>{return response.json()}).
    then((data)=>{
        this.tot=data["tot"]
        this.name=data["name"]
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

export default order_summary