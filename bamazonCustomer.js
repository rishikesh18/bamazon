//decelaring variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");
const isNumber = require('is-number');
var finalCost = 0;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // username
  user: "root",

  // password and database name
  password: "",
  database: "bamazonDB"
});

// function to start for customer of manager
function start() {
  inquirer
    .prompt({
      name: "Options",
      type: "rawlist",
      message: "Are you a manager or a customer?",
      choices: ["Customer", "Manager"]
    })
    .then(function(answer) {     
      if (answer.Options === "Customer") {
        connection.connect(function(err) {
            if (err) throw err;         
            buyProduct();
        });
      } else if(answer.Options === "Manager") {
          connection.connect(function(err) {
            if (err) throw err;        
              manageProduct();
        });     
      }else {        
      }
    });
}
//codes for cusmomer view
function buyProduct(){

    connection.query("SELECT * FROM products", function (error, result) {
      if (error) throw error;
          
      let data,
      output;
      var item = "Item ID";
      var pName = "Product";
      var department = "Department name";
      var cost = "Price";
      var stockQ = "Stock Quantity";
      
      
      var head = [
        item, pName, department, cost, stockQ ,

      ]
      var body = [];
      var i=0;
       data = [
       head
      
      ];
      for (i=0; i < result.length; i ++) {
        var newBody;
        newBody = [result[i].item_id,result[i].product_name,result[i].department_name,result[i].price, result[i].stock_quantity];
      
      data.push(newBody);
      }
     
      output = table(data);
 
      console.log(output);
     askID();
    });  

}
//function to ask id and quantity to customers
function askID() {
  inquirer
  .prompt([
  {
    name: "Item_id",
    type: "Input",
    message: "Type a id number that you like to buy.",
  },
  {
    name: "Quanity",
    type: "input",
    message: "What quanity you like to buy.",
  },
    
  ])
      .then(function(answer) {
        var inputId = parseInt(answer.Item_id);
        var inputQty = parseInt(answer.Quanity);
        
        if ((isNumber(inputId)) && (isNumber(inputQty))) {
          console.log("Your input id number is: " + Math.abs(inputId));
          console.log("Your desired quantity is: " + Math.abs(inputQty));
          checkCalculate(answer);
        }else {
          console.log("Enter a valid ID or Quantity");
          askID();
        }
      });
}
//function to check quantity and calculate price
function checkCalculate(answer) {
        connection.query("SELECT * FROM products where item_id = "+Math.abs(answer.Item_id), function (err, result) {
          if (err) throw err;
        // console.log(result);
          let price=result[0].price;
          let qty=parseInt(answer.Quanity);
          qty = Math.abs(qty);        
          if(result[0].stock_quantity >= answer.Quanity) {            
            yourCost = price * qty;
            console.log ("Your cost is: "+ yourCost);
            finalCost = finalCost + yourCost;
            // return;
            updateTable(answer, result, qty);
          } else {
            console.log("We do not have enough quantity. Please see the list");
          buyProduct();      
          }        
        });         
}
//function to update table after customer buys an item
function updateTable (answer, result, qty) { 
  var reaminingQuantity = (result[0].stock_quantity - qty);
  var query = connection.query(    
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: reaminingQuantity,
      },
      {
        item_id: Math.abs(answer.Item_id)
      }
    ],
    function(err, res) {    
  }
  )
  buyOther();
}
//function to ask customer if he wants to buy another
function buyOther(){  
  inquirer
  .prompt({
    name: "Options",
    type: "rawlist",
    message: "DO you want to buy another?",
    choices: ["Yes", "No"]
  })
  .then(function(answer) {    
    if (answer.Options === "Yes") {      
      console.log("Select another");
      buyProduct();  
       }
       else {		
          console.log("Your total cost is: " + finalCost);
           console.log("Good bye!");          
           connection.end();
       }
    });
}

//Code start for manager view
//fuction for waht manager wants?
function manageProduct() {
  inquirer
    .prompt({
      name: "Options",
      type: "rawlist",
      message: "What do you want?",
      choices: ["View Product", "View Low Inventory", "Add Inventory", "Add New Product"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.Options === "View Product") {
      
            viewProduct();
  
      } else if(answer.Options === "View Low Inventory") {
        
          viewLowInventory();
      
      }else if(answer.Options === "Add Inventory" ){
      
          addInventory();
      
      }else if(answer.Options === "Add New Product" ){
       
          addNewProduct();
      
      }else {
        
      }
    });
}
//function to view list
function viewProduct() {
  connection.query("SELECT * FROM products", function (error, result) {
    if (error) throw error;  
    let data,
    output;
    var item = "Item ID";
    var pName = "Product";
    var department = "Department name";
    var cost = "Price";
    var stockQ = "Stock Quantity";    
    var head = [
      item, pName, department, cost, stockQ ,
    ]
    var body = [];
    var i=0;
     data = [
     head    
    ];
    for (i=0; i < result.length; i ++) {
      var newBody;
      newBody = [result[i].item_id,result[i].product_name,result[i].department_name,result[i].price, result[i].stock_quantity];
    
    data.push(newBody);
    }
   
    output = table(data);

    console.log(output);
   manageOther();
  });  
}
//function to view low inventary
function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5 ", function (error, result) {
    if (error) throw error;
    let data,
    output;
    var item = "Item ID";
    var pName = "Product";
    var department = "Department name";
    var cost = "Price";
    var stockQ = "Stock Quantity";    
    var head = [
      item, pName, department, cost, stockQ,
    ]
    var body = [];
    var i=0;
     data = [
     head    
    ];
    for (i=0; i < result.length; i ++) {
      var newBody;
      newBody = [result[i].item_id,result[i].product_name,result[i].department_name,result[i].price, result[i].stock_quantity];    
    data.push(newBody);
    }   
    output = table(data);
    console.log(output);
   manageOther();
  });  
}
//function to add inventory
function addInventory() {     
    inquirer
    .prompt({
      name: "Options",
      type: "rawlist",
      message: "DO you want to add?",
      choices: ["Yes", "No"]
    })
    .then(function(answer) {    
      if (answer.Options === "Yes") {       
        inquirer
        .prompt([
        {
          name: "Item_id",
          type: "Input",
          message: "Type a id number that you like to add.",
        },
        {
          name: "Quanity",
          type: "input",
          message: "What quanity you like to add.",
        },          
        ])
            .then(function(answer) {
              var inputId = parseInt(answer.Item_id);
              var inputQty = Math.abs(parseInt(answer.Quanity));
              var result;
              if ((isNumber(inputId)) && (isNumber(inputQty))) {
                console.log("Your input id number is: " + Math.abs(inputId));
                console.log("Your added quantity is: " + Math.abs(inputQty));
               // var totalQuantity = (result[0].stock_quantity + qty);
               connection.query("SELECT * FROM products where item_id = "+Math.abs(answer.Item_id), function (err, result) {
                if (err) throw err;
              
                addingQty(answer, result, inputId, inputQty);
                });                
              }else {
                console.log("Enter a valid ID or Quantity");
                addInventory();
              }
            });  
         }         
         else {		
            manageOther();            
         }         
      });
}
function addingQty( answer, result, inputId, inputQty) {
  var query = connection.query(                  
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: (result[0].stock_quantity + inputQty),
      },
      {
        item_id: Math.abs(answer.Item_id)
      }
    ],
    function(err, res) {     
  }
  )
  console.log("product updated");
  manageOther();
}
//function to add new product
function addNewProduct() {
  inquirer
  .prompt([
  {
    name: "Product",
    type: "Input",
    message: "What product do you like to add?",
  },
  {
    name: "Department",
    type: "Input",
    message: "What is the department of the Product?",
  },
  {
    name: "Price",
    type: "Input",
    message: "What is the selling price of one quanity?",
  },
  {
    name: "Quanity",
    type: "input",
    message: "What quanity you like to add?",
  },    
  ])
      .then(function(answer) {
        if ((isNumber(answer.Price)) && (isNumber(answer.Quanity))) {
        var sql = "INSERT INTO products (product_name, department_name,price, stock_quantity) VALUES ('" +answer.Product+"', '"+ answer.Department+"', '" +answer.Price+"', '"+ answer.Quanity+"')";
        connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("One product added");
    manageOther();
  });
  }else {
    console.log("Enter correct data");
    addNewProduct();
  }
      });
}
function manageOther(){
  inquirer
  .prompt({
    name: "Options",
    type: "rawlist",
    message: "DO you want to manage another?",
    choices: ["Yes", "No"]
  })
  .then(function(answer) {    
    if (answer.Options === "Yes") {     
      manageProduct();  
       }
       else {	         
           console.log("Good bye!");         
           connection.end();
       }
    });
}

start();
