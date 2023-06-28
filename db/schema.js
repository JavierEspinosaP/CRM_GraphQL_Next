const { gql } = require('apollo-server')

//Schema

const typeDefs = gql`

    type User {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    type Token {
        token : String
    }

    type Product {
        id: ID
        nombre: String
        stock: Int
        precio: Float
        creado: String
    }

    type Client {
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor: ID
    }

    type Order {
        id: ID!
        pedido: [OrderGroup]
        total: Float
        cliente: ID!
        vendedor: ID!
        fecha: String
        estado: OrderState
    }

    type OrderGroup {
        id: ID!
        cantidad: Int
    }

    input UserInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input ProductInput {
        nombre: String!
        stock: Int!
        precio: Float!
    }

    input ClientInput {
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono: String
    }
 
    input OrderProductInput {
        id: ID!
        cantidad: Int
    }

    input OrderInput {
        pedido: [OrderProductInput]
        total : Float!
        cliente: ID!
        estado: OrderState
    }

    enum OrderState {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }

    type Query {
        #Users
        getUser(token: String!) : User

        #Products
        getProducts: [Product]
        getProduct(id:ID!): Product
        
        #Clientes
        getAllClients: [Client]
        getClientsSeller: [Client]
        getClient(id: ID!): Client

        #Pedidos
        getAllOrders: [Order]

    }

    type Mutation {
        #Users
        newUser(input: UserInput): User
        authUser(input:AuthInput ): Token

        #Products
        newProduct(input: ProductInput): Product
        updateProduct( id: ID!, input: ProductInput ) : Product
        deleteProduct (id: ID!) : String

        #Clients
        newClient(input : ClientInput) : Client
        updateClient(id: ID!, input: ClientInput ) : Client
        deleteClient(id: ID!) : String

        #Orders
        newOrder(input: OrderInput) : Order
    }

`;

module.exports = typeDefs