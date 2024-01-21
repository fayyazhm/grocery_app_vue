
console.log("hello")
new Vue({
    el:"#pass",
    data:{
        passd:"",
        conditions:{
            uppercase:'white',
            lowercase:'white',
            specialCharacter:'white',
            digits:'white',
            length:'white',
            
        },
        lowercase:['a','b','c','d','e','f','g','h','i','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
        uppercase:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        specialCharacter: [
            "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]", "|", "\\", ":", ";", "\"", "'", "<", ">", ",", ".", "?", "/"
          ],
        digits: [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        strength:""
    },

    methods:{
        computer()
        {
            let count=0;
            for (let i in this.conditions)
                {
                    if(this.conditions[i]=='green'){
                        count++}
                }
            if(count==0)this.strength="Please enter a valid password"
            if(count==1)this.strength="POOR"
            if(count==2)this.strength="AVERAGE"
            if(count==3)this.strength="GOOD"
            if(count==4)this.strength="VERY GOOD"
            if(count==5)this.strength="EXCELLENT"
        },
        subm(a,event){
            if(a=="store"){
                if (this.strength=="EXCELLENT"){
                    alert("User Create request sent to admin for authorization")
                    // document.getElementById('edit-store-form').submit();
                }
                else{
                    alert("password criteria not met")
                    event.preventDefault();
                }
            }
            if(a=="user"){
                if (this.strength=="EXCELLENT"){
                    // document.getElementById('edit-user-form').submit();
                }
                else{
                    alert("password criteria not met")
                    event.preventDefault();
                }
            }

        }
    },
    delimiters: ['${', '}'],
    watch:
    {
        passd()
        {   
            this.conditions.lowercase='white'
            this.conditions.uppercase='white'
            this.conditions.digits='white'
            this.conditions.specialCharacter='white'
            this.conditions.length='white'
            console.log(this.strength)
            if(this.passd.length>=8)
                this.conditions.length='green'
            for(let i=0;i<=this.passd.length;i++)
            {
                if(this.lowercase.includes(this.passd.charAt(i)))
                    this.conditions.lowercase='green'
                else if(this.uppercase.includes(this.passd.charAt(i)))
                    this.conditions.uppercase='green'
                else if(this.specialCharacter.includes(this.passd.charAt(i)))
                    this.conditions.specialCharacter='green'
                else if(this.digits.includes(this.passd.charAt(i)))
                    this.conditions.digits='green'
            }
            this.computer()   
        }   
    },


})