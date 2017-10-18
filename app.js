var buggetController=(function(){
    var expense=function(ID,description,value){
        this.ID=ID;
        this.description=description;
        this.value=value;
    };
    var income=function(ID,description,value){
        this.ID=ID;
        this.description=description;
        this.value=value;
    };
    var calculateTotal=function(type){
        var sum=0;
        data.allItem[type].forEach(function(curr){
            sum+=curr.value;
        });
        data.totals[type]=sum;
    };

    var data={
        allItem:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        totalBudget:0,
        percentage:0

    };
    return{
        AddItem:function(type,description,value){
            var ID,newItem;
            if(data.allItem[type].length>0){
                ID=data.allItem[type].length;
            }else{
                ID=0;
            }
           if(type==='exp'){
             newItem=new expense(ID,description,value);
           }else if(type==='inc'){
            newItem=new income(ID,description,value);
           }
           
            data.allItem[type].push(newItem);
            return newItem;
        },
        calculateBudget:function(){
            calculateTotal('inc');
            calculateTotal('exp');
            data.totalBudget=parseFloat( data.totals.inc-data.totals.exp);
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
           
        },

        getBugget:function(){
            return{
                bugget:data.totalBudget,
                expenses:data.totals.exp,
                income:data.totals.inc,
                per:data.percentage
            }
        },
     
        Testing:function(){
            console.log(data);
        }
       
    }



})();

var UIController=(function(){
    var domString ={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value__digit',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage'

    };
    return{
        getInput:function(){
            return{
                type:document.querySelector(domString.inputType).value,
                description: document.querySelector(domString.inputDescription).value,
                value: parseFloat(document.querySelector(domString.inputValue).value),
                inputBtn:document.querySelector(domString.inputBtn)
            };
        },

        addListItem:function(obj,type){
            var html,newHtml,element;
            if(type==='inc'){
                element=domString.incomeContainer;
                html ='<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
            }else if(type==='exp'){
                element=domString.expensesContainer;
                html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml=html.replace("%id%",obj.ID);
            newHtml=newHtml.replace("%desc%",obj.description);
            newHtml=newHtml.replace("%value%",obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeEnd',newHtml);

        },

        clearFields: function(){
            var fields,fieldsArray;
            fields= document.querySelectorAll(domString.inputDescription+ ','+ domString.inputValue);
            fieldsArray= Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(curr,ind,arr){
                curr.value="";
            });

        },
        displayBudget:function(obj){
            document.querySelector(domString.budgetLabel).textContent=obj.bugget;
            document.querySelector(domString.expensesLabel).textContent=obj.expenses;
            document.querySelector(domString.incomeLabel).textContent=obj.income;
            document.querySelector(domString.percentageLabel).textContent=obj.per;
            

        },
     

        getdomString:function(){
            return domString;
        }
    };
})();

var controller=(function(UIctrl,BuggetCtrl){
    var setUpEventListener=function(){
        var DOM =UIctrl.getdomString();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13|| event.which===13){
                ctrlAddItem();
            }
        })
    };

    var ctrlAddItem=function(){
       var input,newItem;
        input =UIctrl.getInput();
        newItem=BuggetCtrl.AddItem(input.type,input.description,input.value);
        if(newItem.description!=="" && newItem.value>0){
            UIctrl.addListItem(newItem,input.type);
            UIctrl.clearFields();
            updateBudget();
           
        }
        
    };
    var updateBudget=function(){
        BuggetCtrl.calculateBudget();
        var bugget=BuggetCtrl.getBugget();
        UIctrl.displayBudget(bugget);
        console.log(bugget);
    };

    return {
        init:function(){
            setUpEventListener();
        }
    };
   

})(UIController,buggetController);
controller.init();