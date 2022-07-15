-- COUNT
select count (*) from employees;

-- SUM
select sum(quantityOrdered) from orderdetails where productCode = "518_1749"

-- AVG

-- GROUP BY
select country, count(*) from customers group by country;

select country, firstName, lastName, email, avg(creditLimit), count(*) from customers
join employees on customers.salesRepEmployeeNumber = employees.employeeNumber
where salesRepEmployeeNumber = 1504
group by country, firstName, lastName, email
order by avg(creditLimit) desc
limit 3;