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
        cliente: Client
        vendedor: ID!
        fecha: String
        estado: OrderState
    }

    type OrderGroup {
        id: ID!
        cantidad: Int!
        nombre: String
        precio: Float
    }

    type TopClient {
        total: Float
        cliente: [Client]
    }

    type TopSeller {
        total: Float
        vendedor: [User]
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
        nombre: String
        precio: Float
    }

    input OrderInput {
        pedido: [OrderProductInput]
        total : Float
        cliente: ID
        estado: OrderState
    }

    enum OrderState {
        COMPLETED
        CANCELED
        PENDING
    }

    type Query {
        #Users
        getUser : User

        #Products
        getProducts: [Product]
        getProduct(id:ID!): Product
        
        #Clientes
        getAllClients: [Client]
        getClientsSeller: [Client]
        getClient(id: ID!): Client

        #Pedidos
        getAllOrders: [Order]
        getOrdersBySeller: [Order]
        getOrderById(id: ID!): Order
        getOrdersByState(estado: OrderState!): [Order]

        #Busquedas avanzadas
        getBestClients: [TopClient]
        getBestSellers: [TopSeller]
        searchProduct( texto: String! ): [Product]

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
        updateOrder(id: ID!, input: OrderInput! ) : Order
        deleteOrder(id: ID!) : String
    }

`;

module.exports = typeDefs