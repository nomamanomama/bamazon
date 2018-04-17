//Create another Node app called`bamazonSupervisor.js`.Running this application will list a set of menu options:

//    * View Product Sales by Department

//     * Create New Department

// When a supervisor selects`View Product Sales by Department`, the app should display a summarized table in their terminal / bash window.Use the table below as a guide.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01 | Electronics | 10000 | 20000 | 10000 |
// | 02 | Clothing | 60000 | 100000 | 40000 |

//     6. The`total_profit` column should be calculated on the fly using the difference between`over_head_costs` and`product_sales`. `total_profit` should not be stored in any database.You should use a custom alias.

// 7. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

//     * Hint: You may need to look into aliases in MySQL.

//    * Hint: You may need to look into GROUP BYs.

//    * Hint: You may need to look into JOINS.

//    * ** HINT **: There may be an NPM package that can log the table to the console.What's is it? Good question :)

//     - - -

var inquirer = require('inquirer');
var mysql = require('mysql');

var inventory;

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'oldNEW47',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log(`connected as id ${connection.threadId}`);
});



function createData(dept, ovhd) {
    console.log("Inserting a new department...\n");
    var query = connection.query('INSERT into departments SET ?',
        {
            department_name: dept,
            over_head_costs: ovhd
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            promptSupervisor();
        }
    );
    // logs the actual query being run
    console.log(query.sql);
}


function readData() {
   
    //console.log("Selecting all products...\n");
    var query = `SELECT 
    department_id, 
    departments.department_name, 
    over_head_costs, 
    ROUND(COALESCE(SUM(product_sales), 0)) AS total_sales, 
    ROUND(COALESCE(SUM(product_sales), 0) - over_head_costs) AS total_profit 
    FROM departments 
    LEFT JOIN products 
    ON(departments.department_name = products.department_name) 
    GROUP BY departments.department_name`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        //locally store current inventory list
        inventory = res;
        //print title and column headings
        console.log(`\n                             Department Summary\n`);
        console.log(`--------+-----------------------+---------------+---------------+----------------`);
        console.log(`| Dept#\t|  Department Name\t|  Ovhd Costs\t|  Prod Sales\t|  Total Profit\t|`);
        console.log(`--------+-----------------------+---------------+---------------+----------------`);
        res.forEach(element =>{
            //department_id | department_name | over_head_costs | product_sales | total_profit
            console.log(`| ${element.department_id}\t|  ${element.department_name} \t|  ${element.over_head_costs}\t\t|  ${element.total_sales}\t\t|  ${element.total_profit}\t\t|`);
            console.log(`--------+-----------------------+---------------+---------------+----------------`);
        });

        promptSupervisor();
    });
}


function showDeptSummary(dept, cost) {
    var total_sales= 0;
    connection.query("SELECT * FROM products WHERE ?",dept, function (err, data) {
        if (err) throw err;
        data.forEach(element => {
            total_sales += element.product_sales;
        });
    });
        //department_id | department_name | over_head_costs | product_sales | total_profit
    console.log(`${element.department_id} |\t${element.department_name} |\t${element.over_head_costs} |\t${total_sales} |\t${total_sales - cost}`);
    

}


// Prompt customer to purchase
function promptSupervisor() {
    //console.log("prompting purchase");
    inquirer.prompt([
        //ask them the ID of the product they would like to buy.
        {
            name: "task",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"],
            message: "Please select from the list:"
        }
    ])
//     * Create New Department
        .then(function (answers, err) {
            switch (answers.task) {
                //list every available item: the item IDs, names, prices, and quantities.
                case "View Product Sales by Department":
                    readData(true);
                    break;
                //allow the supervisor to add a completely new department to the store.
                case "Create New Department":
                    addDept();
                    break;
                case "Exit":
                    connection.end();
                    break;
                default:
                    console.log("Invalid option"); break;
            }

        });
}

function addDept() {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Enter new department name:"
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter department overhead cost:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answers, err) {
            // update the SQL database to reflect the remaining quantity.
            createData(answers.item, answers.quantity);
        });
}

// Running this application will first display all of the items available for sale.Include the ids, names, and prices of products for sale.
promptSupervisor();
