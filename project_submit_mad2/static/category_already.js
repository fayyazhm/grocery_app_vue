const category_already = Vue.component("category_already", {
    template: `<div style='position:relative;top:100px;width:75%;text-align: center;'>
    <br>
    <br>
    <h1 style="color:BLACK">{{ c }} IS ALREADY THERE CANNOT BE ADDED</h1>
  </div>
      `,
    props:["c"]
  });

export default category_already