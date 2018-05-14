var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");



// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

// connect to the mysql server and sql database

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "Options",
      type: "rawlist",
      message: "Are you a manager or a customer?",
      choices: ["Customer", "Manager"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.Options === "Customer") {
        buyProduct();
      }
      else {
        //manageProducts();
      }
    });
}

function buyProduct(){
  console.log("inside buy product");
  connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, result) {
      if (err) throw err;
      console.log("connected");
     // console.log(result);
     console.log(result[0]);
      let data,
      output;
      var item = "Item ID";
      var pName = "Product";
      var department = "Department name";
      var cost = "Price";
      var stockQ = "Stock Quantity";
      
      
      var head = [
        {item, pName, department, cost, stockQ} ,

      ]
      var body = [{head}];
      var i;
      for (i=0; i < 10; i ++) {
        var newBody;
        newBody = [result[i].item_id,result[i].product_name,result[i].department_name,result[i].price, result[i].stock_quantity];
       head.push(newBody);
      }
      console.log(head);


      data = [
       head,
        //body,
       // [result[i].item_id,result[i].product_name,result[i].department_name,result[i].price, result[i].stock_quantity]

      ];
      output = table(data);
 
      console.log(output);
     // askID();
    });  
  });
}
  
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
   
    console.log(answer);
    connection.query("SELECT * FROM products where item_id = "+answer.Item_id, function (err, result) {
      if (err) throw err;
      console.log(result);
      let price=result[0].price;
      let qty=parseInt(answer.Quanity);
    
      if(result[0].stock_quantity >= answer.Quanity) {
        console.log ("Your cost is: "+price * qty);
        return;
      } else {
        console.log("we do not have enough quantity. Please see the list");
       
        return askID();
       

      
      }
     
    }); 
    //buyProduct(); 
  });
}

function buyOther(){
  var buyNext = [
    {
       type: 'confirm',
       name: 'buyNext',
       message: 'Do you want to buy another?',
       default: true
     }
    ];

    inquirer.prompt().then(userWantsTo => {
       if (userWantsTo.buyNext){           
           console.log("Select an item");
          buyProduct();
       }

       else {			
           console.log("Good bye!");
           return;
       }
    });
}

start();
