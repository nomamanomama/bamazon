var inquirer = require ('inquirer');
var mysql = require ('mysql');

var inventory;
var cartTotal = 0;

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'oldNEW47',
    database: 'bamazon'
});

connection.connect( function (err) {
    if(err) throw err;
    console.log(`connected as id ${connection.threadId}`);
});


function updateData(product, quantity, productSale, message = "") {
    console.log("Updating product data...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity,
                product_sales: productSale
            },
            {
                product_name: product
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            console.log(message);
            inquirer.prompt([
                {
                    type:"list",
                    name:"choice",
                    choices: ['Yes','No'],
                    message: "Keep Shopping?"
                }
            ])
            .then(function(answers){
                if (answers.choice === "Yes")
                {
                    readData(false);
                }
                else{
                    console.log("Thanks for shopping!");
                    connection.end();
                }
            }, err)
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function readData(showProducts = false) {
    //console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //locally store current inventory list
        inventory = res;
        // Log all results of the SELECT statement
        if(showProducts) showInventory(res);
        promptPurchase();
    });
}


function showInventory(data) {
    console.log("\n               ********* CURRENT INVENTORY ********\n");
    data.forEach(element =>{
        var qty = element.stock_quantity;
        if (parseInt(qty) === 0) qty = "Out of Stock";
    
        console.log(`ID: ${element.item_id} \t${element.product_name}         \t\tDept: ${element.department_name} \tPrice: ${element.price} \tQty: ${qty}`)
    });
    console.log ("\n              **********************************\n");
}


// Prompt customer to purchase
function promptPurchase() {
    //console.log("prompting purchase");
    inquirer.prompt([
        //ask them the ID of the product they would like to buy.
        {
            name: "item",
            type: "list",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < inventory.length; i++) {
                    choiceArray.push(inventory[i].product_name);
                }
                return choiceArray;
            },
            message: "Which item do you wish to purchase?"
        },
        // * The second message should ask how many units of the product they would like to buy.
        {
            type: "input",
            name: "quantity",
            message: "Enter quantity to purchase:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    console.log("number entered");
                    return true;
                }
                console.log("NaN");
                return false;
            }
        }
    ])
    .then(function(answers, err){
        
        var chosenItem;
        var quantity = parseInt(answers.quantity);
        inventory.forEach(element => {
            if (element.product_name === answers.item){
                chosenItem = element;
            }
        });

        // check if your store has enough of the product to meet the customer's request.
        if (chosenItem.stock_quantity < quantity){
            // If not, the app should log a phrase like`Insufficient quantity!`, and then prevent the order from going through. 
            console.log(`Insufficient quantity! Currently this item only has ${chosenItem.stock_quantity} in stock.`);
            readData(false);
        }
        else{
        // else if your store _does_ have enough of the product, fullfil the customer's order.
        // update the SQL database to reflect the remaining quantity.
            
        // Once the update goes through, show the customer the total cost of their purchase.

            // update product_sales value with each sale.
            var productCost = parseFloat((chosenItem.price * quantity).toFixed(2));
            var productSales;
            if(isNaN(parseFloat(chosenItem.product_sales)) )
                productSales = productCost;
            else
                productSales = parseFloat(chosenItem.product_sales) + productCost;
            cartTotal += productCost;
            var message = `Your new total cost is $${cartTotal.toFixed(2)}.`;
            updateData(answers.item, chosenItem.stock_quantity - quantity, productSales, message); 
        }       


    });
}




// Running this application will first display all of the items available for sale.Include the ids, names, and prices of products for sale.
readData(true);

