const product_delete_error = Vue.component("product_delete_error", {
    template: `<div style='position:relative;top:100px;width:75%;text-align: center;'>
    <br>
    <br>
    <h1 style="color:BLACK">{{ c }} IS ALREADY PURCHASED, SO CANNOT BE DELETED</h1>
  </div>
      `,
    props:["c"]
  });

export default product_delete_error