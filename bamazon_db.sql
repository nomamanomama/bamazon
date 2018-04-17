-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS bamazon;
-- Create a database called programming_db --
CREATE DATABASE bamazon;

-- Use programming db for the following statements --
USE bamazon;

CREATE TABLE IF NOT EXISTS products(
	-- item_id (unique id for each product) which will automatically increment 
	item_id INTEGER(10) auto_increment,

	-- product_name (Name of product)
	product_name varchar(32),
    
	-- department_name
	department_name varchar(32),
    
	-- price (cost to customer)
	price decimal(10,2),
    
	-- stock_quantity (how much of the product is available in stores)
	stock_quantity integer(10), 
    
    product_sales decimal(10,2),
  
  -- Set the id as this table's primary key
	primary key(item_id)
);

CREATE TABLE IF NOT EXISTS departments (
	department_id INTEGER(10) auto_increment,
	department_name varchar(32),
	over_head_costs decimal(10,2),
    primary key (department_id)
);


-- seed data

insert into products (
 product_name
, department_name
, price
, stock_quantity
) values
( 'Powerbeats3 Earbuds', 'Games/Electronics', 134.99, 12 ),
( 'FireTV Firestick', 'Games/Electronics', 44.99, 20 ),
( 'Apple Watch Series 3', 'Games/Electronics', 399.99, 5 ),
( 'Calvin Klein Blanket', 'Home Bed & Bath', 89.99, 8 ),
( 'Bamazon Towel Set of 4', 'Home Bed & Bath', 34.49, 25 ),
( 'Black+Decker 9v drill', 'Hardware & Tools', 29.99, 4 ),
( 'Fairy Lights 39Ft', 'Patio and Garden', 14.99, 12 ),
( 'Bamazon Towel Set of 8', 'Home Bed & Bath', 54.49, 5 ),
( 'Black+Decker 12v drill', 'Hardware & Tools', 89.99, 7 ),
( 'Fairy Lights 78Ft', 'Patio and Garden', 22.99, 6 );


INSERT INTO departments (
	department_name,
	over_head_costs
)VALUES
('Games/Electronics', 300),
('Home Bed & Bath', 100),
('Patio and Garden', 200),
('Hardware & Tools', 100);

-- USE bamazon;
-- SELECT department_id, departments.department_name, over_head_costs,ROUND(SUM(product_sales),2) AS total_sales, ROUND(COALESCE(SUM(product_sales), 0) - over_head_costs, 2) AS total_profit
--  FROM departments LEFT JOIN products ON (departments.department_name = products.department_name) group by departments.department_name;
 
select * from departments;

 select * from products order by department_name;