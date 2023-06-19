//Resolvers
const User = require('../models/User');
const Product = require('../models/Product');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const salt = 10
require('dotenv').config({ path: '.env' })

const createToken = (user, secret, expiresIn) => {
    console.log(user);
    const { id, nombre, apellido, email } = user;
    return jwt.sign({id}, secret, {expiresIn})
}
const resolvers = {
    Query: {
        getUser: async (_, {token}) => {
            const userId = await jwt.verify(token, process.env.SECRET)

            return userId
        }

    },
    Mutation: {
        newUser: async (_, { input }) => {

            const { email, password } = input
            //Check if user is registered
            const userExists = await User.findOne({ email });
            if (userExists) {
                throw new Error("User already registered")
            }

            //Hash password

            input.password = await bcryptjs.hash(password, salt)

            // Save to db

            try {
                const user = new User(input);
                user.save() // user saved
                return user;
            }
            catch (e) {
                console.log(e);
            }
        },
        authUser: async (_, { input }) => {
            const { email, password } = input
            //If user exists
            const userExists = await User.findOne({ email })
            if (!userExists) {
                throw new Error("User doesn't exist")
            }

            //Check password
            const correctPassword = await bcryptjs.compare(password, userExists.password)
            if (!correctPassword) {
                throw new Error("Password is not correct")
            }
            //Create token

            return {
                token: createToken(userExists, process.env.SECRET, '24h')
            }
        },
        newProduct: async (_, {input }) => {
            try{
                const product = new Product(input);

                //store in db

                const result = await product.save()

                return result
            }
            catch(error){
                console.log(error);
            }
        }
    }
}

module.exports = resolvers