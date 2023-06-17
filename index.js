const { ApolloServer} = require('apollo-server')
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');


const connectDB = require('./config/db');

//connect to database
connectDB();

//server
//Declaramos una instancia de Apollo y le pasamos el schema y los resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers
});

//start the server
server.listen().then((url) => {
    console.log(`servidor listo en la URL ${url.url}`);
})