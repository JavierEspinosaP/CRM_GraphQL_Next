# CRM Application

## Introduction

This CRM (Customer Relationship Management) application is a modern and scalable solution for managing clients, products, and orders. Leveraging technologies like Next.js, React, Apollo Client, GraphQL, and MongoDB. 
This document provides an overview of the application's features, usage, and technical implementation.

### Deployment URL: 
[https://crm-graphql-next.duckdns.org/](https://crm-graphql-next.duckdns.org/)

## Table of Contents

- Overview
- Technologies Used
- Architecture
- Application Features
    - Authentication
    - Client Management
    - Product Management
    - Order Management
    - Sales Statistics
- Routes
- Docker Compose Setup
    - Services
- How to Run the Application
- Deployment

## Overview
The CRM application is designed to assist businesses in managing their customer relationships, products, and orders efficiently. The application provides a comprehensive set of features that allow users to track customer interactions, manage product inventories, and process orders. The application is built with scalability in mind, utilizing Docker Compose for container orchestration, ensuring that it can be deployed easily across different environments.

## Technologies Used
 - Frontend: Next.js, React, Tailwind CSS
 - Backend: Node.js, Apollo Server, GraphQL
 - Database: MongoDB with Mongoose
 - Containerization: Docker, Docker Compose
 - Authentication: JWT (JSON Web Tokens)
 - State Management: Apollo Client, React Context API
 - Validation: Formik, Yup

## Architecture
The application is divided into three primary services, orchestrated using Docker Compose:

### Client:

Built with Next.js and React, the client service handles the frontend of the application. It is responsible for rendering the user interface and interacting with the backend API through Apollo Client.

### Server:

The server service is built with Node.js and Apollo Server. It handles all business logic and data processing, interacting with MongoDB to manage data persistence. The server exposes a GraphQL API used by the client to perform operations.

### Database:

MongoDB serves as the database service, storing all data related to clients, products, orders, and users. Mongoose is used to define the data models and schemas.

## Application Features

### Authentication

- User Registration: New users can register by providing their name, surname, email, and password.
- Login: Registered users can log in using their email and password. Upon successful login, a JWT is issued and stored in a cookie for session management.
- Protected Routes: Access to certain routes (e.g., /, /productos, /pedidos) is restricted to authenticated users only.

### Client Management

- Client Listing: Users can view a list of clients, each with details such as name, company, email, and phone number.
- Add Client: Users can add new clients by filling out a form with the necessary details.
- Edit Client: Existing client details can be edited to reflect changes in information.
- Delete Client: Users can delete clients from the system.

### Product Management

- Product Listing: Users can view all products, including details such as name, price, and stock levels.
- Add Product: New products can be added by specifying their name, price, and available stock.
- Edit Product: Users can update product information, such as price or stock levels.
- Delete Product: Products can be removed from the inventory.

### Order Management

- Order Listing: Users can view all orders, with details including the client, products ordered, quantities, total cost, and order status.
- Create Order: New orders can be created by selecting a client, adding products, and specifying quantities.
- Update Order: Users can update the status of an order (e.g., pending, completed, canceled).
- Delete Order: Orders can be removed from the system.

### Sales Statistics
- Best Clients: Displays a list of top clients based on order volume or frequency.
- Best Sellers: Shows top-performing sales representatives based on their sales records.


## Routes
The application is structured with the following routes:

- /bestClients: View top clients.
- /bestSellers: View top-performing sales representatives.
- /: Manage clients (list, add, edit, delete).
- /productos: Manage products (list, add, edit, delete).
- /pedidos: Manage orders (list, create, update, delete).
- /login: User login.
- /signup: User registration.
- /newClient: Add a new client.
- /newProduct: Add a new product.
- /newOrder: Create a new order.
- /editClient/:id: Edit client details.
- /editProduct/:id: Edit product details.

## Docker Compose Setup

### Services
Docker Compose orchestrates three main services:

#### Client:

- Builds: The frontend of the application using Next.js.
- Exposes: Port 3000 for web access.

#### Server:

- Builds: The backend using Node.js and Apollo Server.
- Exposes: Port 4000 for API access.

#### Database (MongoDB):

- Runs: MongoDB service.
- Exposes: Port 27017 for database access.

## How to Run the Application

To start the application using Docker Compose, follow these steps:

- Ensure Docker and Docker Compose are installed on your machine. You will also need an application like Docker Desktop (for Windows or macOS) or a similar tool that can manage the containers that will be launched.

- Clone the repository to your local machine:

```
git clone https://github.com/JavierEspinosaP/CRM_GraphQL_Next.git
```

```
cd CRM_GraphQL_Next
```

### Setting Up Environment Variables
Before running the application, you need to set up the environment variables required by the application. These variables are crucial for connecting to the database and ensuring secure authentication.

#### Steps to Set Up Environment Variables:
- Locate the .env.example file:

In the root directory of the cloned repository, you will find a file named .env.example. This file contains placeholders for all the environment variables needed.
Create a new .env file:

Copy the .env.example file and rename the copy to .env:

```
cp .env.example .env
```

- Edit the .env file:

    - Open the newly created .env file.

    - Replace the placeholder values with your own configuration, such as your MongoDB connection string and JWT secret. For example:

```
DB_MONGO=mongodb://localhost:27017/CRMGraphQL
SECRET=your_secret_key_here
```


### Build and start the services:

```
docker-compose up --build
```

This command will build the Docker images for the client and server, and then start all three services (client, server, and db).

#### Access the application:

- The client application will be available at http://localhost:3000

- The GraphQL API will be available at http://localhost:4000

- MongoDB will be running on localhost:27017, accessible with any MongoDB client.

#### Shut down the application:

```
docker-compose down
```

This command stops and removes all the containers.

## Development and Deployment
### Development
For local development without Docker:

#### Build and Run a MongoDB Container
- Pull the MongoDB Docker Image:

First, you need to pull the MongoDB image from Docker Hub. You can do this with the following command:

```
docker pull mongo:latest
```

- Run the MongoDB Container:

After pulling the image, you can run a MongoDB container. Ensure that you map the ports correctly and mount a volume if you want data persistence.

```
docker run --name mongodb-local -p 27017:27017 -d mongo:latest
```

##### --name mongodb-local: This names the container "mongodb-local".

##### -p 27017:27017: Maps the default MongoDB port (27017) to your local machine.

##### -d: Runs the container in detached mode.

#### Start the Server:

```
pnpm install
```

Run the server:

```
pnpm run dev
```

The server will start on http://localhost:4000

#### Start the Client:

Open a new terminal window, navigate to the client directory, and install the dependencies:

```
cd client
```

```
pnpm install
```

Run the client:

```
pnpm run dev
```

The client application will start on http://localhost:3000

## Deployment
The application has been deployed using a Droplet from DigitalOcean with a 20GB volume attached.

### Virtual Machine Setup:

A virtual machine running Ubuntu was created within the Droplet.

The project was uploaded to this virtual machine.

### Docker Compose Orchestration:

Docker Compose was used to orchestrate the server and database services, which were deployed on the attached volume.

The client service was deployed directly on the virtual machine.

### DNS and SSL Configuration:

Duck DNS was used to assign a DNS to the application, making it accessible via 
- https://crm-graphql-next.duckdns.org/.

An SSL certificate was configured to secure the application with HTTPS, ensuring that all data transmitted between the client and server is encrypted.

#### For any questions or contributions, PLEASE contact me through mail (javierepsinosapasamontes@gmail.com)
