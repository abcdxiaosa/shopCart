Vue.filter("money",function(value,type){
    return "￥ "+value.toFixed(2)+type
})





var vm = new Vue({
    el: "#app",
    data: {
       totalMoney: 0,
       totalPrice: 0,
       delFlag: false,
       productList: [],
       checkAllFlag: false,
       curProduct: null
    },
    filters:{
        formatMoney: function(value){
            return "￥ " + value.toFixed(2)
        }
    },
    mounted: function(){
       this.cartView()
    },
    methods:{
        cartView:function(){
            this.$http.get("data/cartData.json").then(res=>{
                this.productList = res.data.result.list
                this.totalMoney = res.data.result.totalMoney
            });
        },
        changeMoney: function(product, way) {
            if (way>0) {
               product.productQuantity++
            }else{
                product.productQuantity--
               if (product.productQuantity<1) {
                product.productQuantity = 1
               }
            }
            this.calcTotalPrice()  
        },
        selectedProduct: function(item){
           if(typeof item.checked == "undefined"){
              this.$set(item, "checked", true)
           }else{
              item.checked = !item.checked
           }
           this.calcTotalPrice()
        },
        checkAll: function(flag){
           this.checkAllFlag = flag//数值相同
           var _this = this
           this.productList.forEach(function(item, index){
             if(typeof item.checked == "undefined"){//为真值时，说明没有checked变量
                _this.$set(item, "checked", flag)//添加checked变量
             }else{//为假值时说明有checked变量
                item.checked = flag
             }
           })
           this.calcTotalPrice()           
        },
        calcTotalPrice: function(){
            var _this = this
            this.totalPrice = 0
            this.productList.forEach(function(item, index){
                if(item.checked){
                  _this.totalPrice += item.productQuantity*item.productPrice
                }
            })
        },
        delConfirm: function(item){
            this.delFlag = true 
            this.curProduct = item
        },
        delProduct: function(){
            var index = this.productList.indexOf(this.curProduct)
            this.productList.splice(index, 1)
            this.delFlag = false
            this.calcTotalPrice() 
        }
    }
});
