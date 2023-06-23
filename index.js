const { ApolloServer} = require('apollo-server')
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');

//connect to database
connectDB();

//server
//Declaramos una instancia de Apollo y le pasamos el schema y los resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        // console.log(req.headers['authorization']);
        const token = req.headers['authorization'];
        if (token) {
            try {
                const usuario = jwt.verify(token, process.env.SECRET)
                return {
                    usuario
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
});

//start the server
server.listen().then((url) => {
    console.log(`servidor listo en la URL ${url.url}`);
})