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

    input UserInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    type Query {
        obtenerCursos: String
    }

    type Mutation {
        newUser(input: UserInput): String
    }


`;

module.exports = typeDefs