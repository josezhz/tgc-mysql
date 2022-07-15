-- 7
select customers.customerNumber, sum(payments.amount) from customers
join payments on customers.customerNumber = payments.customerNumber
where customers.country = "USA"
group by customers.customerNumber;

-- 8
select offices.state, count(*) from employees
join offices on employees.officeCode = offices.officeCode
where offices.country = "USA"
group by offices.state;

-- 9
select customerName, avg(amount) from payments
join customers on payments.customerNumber = customers.customerNumber
group by payments.customerNumber, customers.customerNumber;

-- 10
select customerName, avg(amount) from payments
join customers on payments.customerNumber = customers.customerNumber
group by payments.customerNumber
having sum(amount) > 10000;

-- 11
select orderdetails.productCode, sum(quantityOrdered) from orderdetails
left join products on orderdetails.productCode = products.productCode
group by products.productCode
order by sum(quantityOrdered) desc
limit 10;