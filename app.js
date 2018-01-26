  //Budget budgetController

  var  budgetController = (function(){

    var Expense = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    };

    var Income = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
    };

    Expense.prototype.calcPercentages = function(totalIncome){

      if(totalIncome > 0){
          this.percentage = Math.round((this.value/totalIncome)*100);
      }else {
        this.percentage = -1;
      }

    };

    Expense.prototype.getPercentage = function(){
      return this.percentage;
    };

    var calculateTotal = function(type){
      var sum = 0;
      data.allItem[type].forEach(function(curr){
      // console.log(curr.value+" curr value");
      //  sum = sum + curr.Value;
        sum += curr.value;
      //  console.log(curr.value+" curr.value is printing ");
      //  console.log(sum+" sum is not printing");
      });
      /*

      */
      data.total[type] = sum;
      //console.log(data.total.[type]+" arr");
    };

    var data = {

      allItem: {
        exp: [],
        inc: []
      },
      total: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1
      //totalInc: 0,
      //totalExp: 0
    };
    return {
      addItem: function(type, des, val){
        var newItem, ID;
        //ID = last ID +1;
        //create new id
        if(data.allItem[type].length > 0){
          //console.log(data.allItem[type]);
        ID = data.allItem[type][data.allItem[type].length-1].id+1;
        //create new item based on exp and inc type
      }else {
        ID = 0;
      }


        if(type === 'exp'){
        newItem = new Expense(ID, des, val);
      }else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      //push data to data structure
          data.allItem[type].push(newItem);
          //return the new element;
          return newItem;
      },

      deleteItem: function(type, id){
        var ids, index;

        var ids =  data.allItem[type].map(function(current){
          return current.id
        });

        index = ids.indexOf(id);

        if(index !== -1){
          data.allItem[type].splice(index, 1);
        }else{

        }
      },

      calculateBudget: function(){

        //Calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        // calculate the budhet: income - expenses

        data.budget = data.total.inc - data.total.exp;

        //calculate the percentage of income that we setupEventListener
        if(data.total.inc > 0){
        data.percentage = Math.round((data.total.exp/data.total.inc)*100);
      }else {
        data.percentage = -1;
      }

      },

      calculatePercentages: function(){
        data.allItem.exp.forEach(function(cur){
          cur.calcPercentages(data.total.inc);
        });

      },

      getPercentages: function(){
        var allPerc = data.allItem.exp.map(function(cur){
          return cur.getPercentage();
        });
        return allPerc;
      },

      getBudget: function(){
        return{
          budget: data.budget,
          totalInc: data.total.inc,
          totalExp: data.total.exp,
          percentage: data.percentage
        };
      },


      testing: function(){
        console.log(data);
      }

    };



  })();

  // UI controller
  var UIController = (function(){
  //some code
  var DOMstring = {
    inputType: '.add__type',
    inputDescripion: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expeneseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type){
    var numSplit;
    num = Math.abs(num);
    num =num.toFixed(2);

    numSplit = num.split('.')
    int = numSplit[0];
    if(int.length > 3){
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, int.length);

    }else {

    }

    dec = numSplit[1];

    return (type === 'exp'? '-' : '+')+int + '.' + dec;

  };

  var nodeListForEach = function(list, calllback){
    for(var i=0; i<list.length;i++){
      calllback(list[i], i);
    }
  };

  return {
    getinput: function(){
      return {
         type: document.querySelector(DOMstring.inputType).value, //will be either income or expencess
         description: document.querySelector(DOMstring.inputDescripion).value,
         value: parseFloat(document.querySelector(DOMstring.inputValue).value)
      };
    },

    addListItem: function(obj, type){
      var html, newHtml, element;

      // Create HTML string with placeholder text
      if(type == 'inc'){
        element = DOMstring.incomeContainer;

      html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }else if(type === 'exp') {
        element = DOMstring.expenseContainer;

      html  = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));
      //Insert the html into DOM
      ///document.querySelector('.')

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID){
      var el =   document.getElementById(selectorID);
    el.parentNode.removeChild(el);

    },

      clearFields: function(){
        var fields, feildsArr;
      fields  = document.querySelectorAll(DOMstring.inputDescripion + ', ' + DOMstring.inputValue);

      feildsArr = Array.prototype.slice.call(fields);

      feildsArr.forEach(function(current, index, array){
        current.value = "";
      });
      feildsArr[0].focus();
      },

      displayBudget: function(obj){

        obj.budget > 0? type = 'inc' : type = 'exp';

        document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstring.expeneseLabel).textContent = formatNumber(obj.totalExp, 'exp');


        if(obj.percentage > 0){
          document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + '%';
        }else{
          document.querySelector(DOMstring.percentageLabel).textContent = '--';
        }

      },

      displayPercentages: function(percentages){
        var fields = document.querySelectorAll(DOMstring.expensesPercLabel);

        nodeListForEach(fields, function(current, index){

          if(percentages[index] > 0){
            current.textContent = percentages[index] + '%';
          }else {
            current.textContent = '--';
          }
        });

      },

      displayMonth: function(){
        var now, year,currentMonthIndex, arrayOfStringForAllMonths;
        now = new Date();
        //var

        arrayOfStringForAllMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        year = now.getFullYear();
        currentMonthIndex = now.getMonth();

        document.querySelector(DOMstring.dateLabel).textContent = arrayOfStringForAllMonths[currentMonthIndex]+' '+ year;
      },

      changedType: function(){
        var fields = document.querySelectorAll(
          DOMstring.inputType + ',' +
          DOMstring.inputDescripion + ',' +
          DOMstring.inputValue);

        nodeListForEach(fields, function(cur){
          cur.classList.toggle('red-focus');
        });
        document.querySelector(DOMstring.inputBtn).classList.toggle('red');
      },

    getDOMstring: function(){
      return DOMstring;
    }

  };
  })();

  // Global app controller
  var controller = (function(budgetCtrl, UICtrl){

    var setupEventListener = function(){

      var DOM = UICtrl.getDOMstring();
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

      document.addEventListener('keypress', function(event ){
        //console.log(event);
      if(event.keyCode === 13 || event.which === 13){
      //  console.log("Enter was pressed");
        // 1. get the filed input data
        // 2. Add item to the budget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on UI
        ctrlAddItem();
      }

      });
      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
      document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    updatePercentages = function(){

      //1.calculate the updatePercentages
      budgetCtrl.calculatePercentages();
      //2. Read the percentages from the budget controller
      var percentages = budgetCtrl.getPercentages()
      //3. Update the UI with new percentages
      UICtrl.displayPercentages(percentages);
    };

    var updateBudget = function(){

    //  1. Calculate the budget__title
        budgetCtrl.calculateBudget();
      //2. Return the budget
      var budget = budgetCtrl.getBudget();
      //3. Display the budget
      //console.log(budget);

      UICtrl.displayBudget(budget);

    };


  var ctrlAddItem = function(){
    var input, newItem;
    // 1. get the filed input data
     input = UICtrl.getinput();
      //console.log(input);
      if(input.description !== "" && !isNaN(input.value) && input.value > 0){

        // 2. Add item to the budget controller
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        //4. lear feild
        UICtrl.clearFields();
        // 5. Calculate and update the budget
         updateBudget();

        // 6.calculate and update the updatePercentages

        updatePercentages();

      }else{}

    //console.log("is it works?");
  };

  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;
    itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      //2. delete the item from the UI

      UICtrl.deleteListItem(itemID);

      //3. update and show the new budget
        updateBudget();

        //4. calculate and update the updatePercentages
        updatePercentages();

    }else{

    }



  };


  return {
    init: function(){
      console.log("Application has started.");
      UICtrl.displayMonth();
        UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        });
      setupEventListener();
    }
  };

  })(budgetController, UIController);

controller.init();

