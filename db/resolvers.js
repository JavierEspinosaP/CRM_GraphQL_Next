//Resolvers
const User = require('../models/User');

const resolvers = {
    Query: {
        obtenerCursos: () => "Algo"

    },
    Mutation: {
        newUser: async (_, {input}) => {

            const {email, password} = input
            //Check if user is registered
            const userExists = await User.findOne({email});
            console.log(userExists);
            
            //Hash password

            // Save to db
        }
    }
}

module.exports = resolvers