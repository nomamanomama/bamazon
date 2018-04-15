// * Create a new Node application called`bamazonManager.js`.Running this application will:

// * List a set of menu options:

        // * View Products for Sale

        // * View Low Inventory

        // * Add to Inventory

        // * Add New Product



var inquirer = require('inquirer');
var mysql = require('mysql');

var inventory;
var cartTotal = 0;

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'oldNEW47',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
});



function createData(name, dept, price, qty) {
    console.log("Inserting a new product...\n");
    var query = connection.query('INSERT into products SET ?',
        {
            product_name: name,
            department_name: dept,
            price: price,
            stock_quantity: qty
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            promptManager();
        }
    );
    // logs the actual query being run
    console.log(query.sql);
}

function updateData(product, quantity) {
    console.log("Updating product data...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },
            {
                product_name: product
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            promptManager();
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function deleteData(product_name) {
    console.log("Deleting products...\n");
    var query = connection.query(
        "DELETE FROM products WHERE ?",
        {
            product_name: product_name
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products deleted!\n");
        }
    );
    console.log(query.sql);
}

function readData(showProducts = false, lowQtyOnly = false) {
    //console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //locally store current inventory list
        inventory = res;
        // Log all results of the SELECT statement
        if (showProducts) showInventory(res, lowQtyOnly);
        promptManager();
    });
}


function showInventory(data, lowQtyOnly = false) {
    var invType = "CURRENT";
    if (lowQtyOnly) invType = "**** LOW";
    console.log(`\n               ********* ${invType} INVENTORY ********\n`);
    data.forEach(element => {
        var qty = element.stock_quantity;
        if (parseInt(qty) === 0) qty = "Out of Stock";
        if (!lowQtyOnly || parseInt(element.stock_quantity) < 5 )
        console.log(`ID: ${element.item_id} \t${element.product_name}         \t\tDept: ${element.department_name} \tPrice: ${element.price} \tQty: ${qty}`)
    });
    console.log("\n              **********************************\n");
}


// Prompt customer to purchase
function promptManager() {
    //console.log("prompting purchase");
    inquirer.prompt([
        //ask them the ID of the product they would like to buy.
        {
            name: "task",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product", "Exit"],
            message: "Please select from the list:"
        }
    ])
        .then(function (answers, err) {
            switch(answers.task){
                //list every available item: the item IDs, names, prices, and quantities.
                case "View Products for Sale":
                    readData(true);
                break;
                //list all items with an inventory count lower than five.                
                case   "View Low Inventory":
                    readData(true, true);
                break;
                //display a prompt that will let the manager "add more" of any item currently in the store.
                case "Add to Inventory":
                    addInventory();
                break;
                //allow the manager to add a completely new product to the store.
                case "Add New Product":
                    addProduct();
                break;
                case "Exit":
                    connection.end();
                    break;
                default:
                    console.log("Invalid option"); break;
            }

        });
}

function addInventory() {
    inquirer.prompt([
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
            message: "Select item to add inventory:"
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter quantity to add:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answers, err) {

            var chosenItem;
            var quantity = parseInt(answers.quantity);
            inventory.forEach(element => {
                if (element.product_name === answers.item) {
                    chosenItem = element;
                }
            });
            // update the SQL database to reflect the remaining quantity.
            updateData(answers.item, chosenItem.stock_quantity + quantity);
        });
}

function addProduct() {
    //console.log("prompting purchase");
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Enter new product name:"
        },
        {
            name: "dept",
            type: "list",
            choices: ["Electronics", "Hardware & Tools", "Home Bed & Bath", "Patio and Garden"],
            message: "Select department:"
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter quantity:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "price",
            message: "Enter price:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },

    ])
        .then(function (answers, err) {
            // add new item to the SQL database .
            createData(answers.item, answers.dept, answers.price, answers.quantity);
        });
}


// Running this application will first display all of the items available for sale.Include the ids, names, and prices of products for sale.
promptManager();
