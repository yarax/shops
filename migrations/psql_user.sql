CREATE ROLE admin superuser;
CREATE USER roman;
GRANT admin TO roman;
ALTER ROLE roman WITH LOGIN;
