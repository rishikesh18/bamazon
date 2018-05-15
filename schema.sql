-- Drops the db if it already exists --
DROP DATABASE IF EXISTS bamazonDB;
-- Create a database 
CREATE DATABASE bamazonDB;

USE bamazonDB;

-- Use db for the following statements --

CREATE TABLE products(
  -- Create a numeric column called "id"its default value as we create new rows. --
	item_id INTEGER(10)  auto_increment NOT NULL ,
  -- Create a string column called....--
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100),  
	price  DECIMAL(6,2),
	stock_quantity INTEGER(4),
     
  -- Set the item_id as this table's primary key
  PRIMARY KEY(item_id)
);
-- populating values --
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Hurricane", "Wine/Beer", 1.19, 30);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("M&N candy", "7% grocery", 1.29, 50);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Deer Park water", "2% grocery", 0.98, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Ice", "2% grocery", 0.98, 80);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Spicy Hot lottery", "Instant lottery", 5.00, 60);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Extreme Millions", "Instant lottery", 30.00, 30);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Newport Menthol 100", "Tobacco", 4.89, 50);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Edge beer", "Wine/Beer", 1.99, 40);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Ice House beer", "Wine/Beer", 1.49, 30);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Milky way candy", "7% grocery", 1.29, 30);

SELECT * FROM products

