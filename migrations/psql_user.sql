CREATE ROLE admin superuser;
CREATE USER rax;
GRANT admin TO rax;
ALTER ROLE rax WITH LOGIN;