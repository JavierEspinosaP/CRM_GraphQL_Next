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

    type Query {
        #Users
        getUser(token: String!) : User

        #Products
        getProducts: [Product]
        getProduct(id:ID!): Product

    }

    type Mutation {
        # Users
        newUser(input: UserInput): User
        authUser(input:AuthInput ): Token

        #Products
        newProduct(input: ProductInput): Product

    }

`;

module.exports = typeDefs