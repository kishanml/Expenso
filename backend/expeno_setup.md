# Expenso Setup

## 1. Create a virtual env

For that you need to install virtualenv in global python version
command: `pip install virtualenv`

## 2. Create a virtual env

-   `virtualenv expenso_env`

## 3. Activate the virtual env created

-   `source expenso_env/bin/Activate`

## 4. Install all python packages required for the django project

-   `pip install -r requirements.txt`

## 5. Then make sure to install PostgreSQL

### Requirement for Running all the functions

-   `sudo apt-get install python3 postgresql libpq-dev python3-dev python3-pip virtualenv`

## 6. Database setup

Open PostgreSQL in terminal

-   `sudo -u postgres psql`

Create database with name as expenso

-   `CREATE DATABASE expenso;`

Create user with encrypted password

-   `CREATE USER expenso_user WITH ENCRYPTED PASSWORD 'expenso@123';`

Grant all access and privileges to the user for the database expenso

-   `CREATE USER expenso_user WITH ENCRYPTED PASSWORD 'expenso@123';`

Make the database owner to the user

-   `ALTER DATABASE expenso OWNER TO expenso_user;`

## 7. Create the Django migrations

-   `python3 manage.py makemigrations`

## 8. Migrate the changes

-   `python3 manage.py Migrate`

## 9. Create a superuser for the admin panel view

-   `python3 manage.py createsuperuser`

Provide all necessary details

## 10. Run the backend application

-   `python3 manage.py runserver`

This will run the backend application by default on port 8000.

If you want to change the port,
you can run the following command:

-   `python3 manage.py runserver <port>`

## 11. Go to the admin panel to check the tables and added data

-   `http://127.0.0.1:8000/admin/`
