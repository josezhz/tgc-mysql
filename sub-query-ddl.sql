select * from customers where creditLimit > (select avg(creditLimit) from customers);