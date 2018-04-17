# bamazon
node.js and MySql online store application

Bamazon command line application allowing 3 types of users: customer, manager and supervisor. 

## Customers 
Customers can run the CLI for customers with node bamazoncustomer.js to view items for purchase, price, etc. Customers are prompted to select an item for purchase from a list of items and enter the quantity desired. If the quantity of the selected item is in stock, customers are given a subtotal and prompted to Keep shopping or exit. A final total is given when they are done shopping.

## Managers
Managers can run the CLI for managers with node bamazonmanager.js to:
    * View Current Products for Sale (view all products, product sales, quantities)
    * View Low Inventory (products with less than 5 items in stock)
    * Add to Inventory (select from list of current products and enter a quantity to add to inventory)
    * Add a New Product (select from a list of current departments and add a new product to the department)

## Supervisors
Supervisors can run the CLI for managers with node bamazonsupervisor.js to:
    * View summary of each department's product sales, overhead and profit
    * Add a new department

## Demo
![bamazon - Demo](https://nomamanomama.github.io/bamazon/images/bamazon.gif)

## Technology Used
node.js
npm packages: inquirer, mysql
MySQL

## Installation
* Download all files from repo: https://github.com/nomamanomama/bamazon
* Create database: Run bamazon_db.sql to create database with products and department tables and initial seed data.
* Install packages: npm install

## Run
Navigate to install directory and run selected node.
*Customer Node: from command line enter: node bamazoncustomer.js
*Manager Node: from command line enter: node bamazonmanager.js
*Supervisor Node: from command line enter: node bamazonsupervisor.js

## Future Development
Create a web interface with login to direct users to appropriate node or node selection.
