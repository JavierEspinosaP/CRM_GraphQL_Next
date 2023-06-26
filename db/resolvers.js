//Resolvers
const User = require('../models/User');
const Product = require('../models/Product');
const Client = require('../models/Client');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const salt = 10
require('dotenv').config({ path: '.env' })

const createToken = (user, secret, expiresIn) => {
    console.log(user);
    const { id, nombre, apellido, email } = user;
    return jwt.sign({ id }, secret, { expiresIn })
}
const resolvers = {
    Query: {
        getUser: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRET)

            return userId
        },
        getProducts: async () => {
            try {
                const products = await Product.find({})
                return products
            } catch (error) {
                console.log(error);
            }
        },
        getProduct: async (_, { id }) => {
            //check if product exists
            const product = await Product.findById(id)

            if (!product) {
                throw new Error("Product not found")
            }

            return product
        },
        getAllClients: async () => {
            try {
                const clients = await Client.find({})
                return clients
            } catch (error) {
                console.log(error);
            }
        },
        getClientsSeller: async (_, { }, ctx) => {
            try {
                const clients = await Client.find({ vendedor: ctx.usuario.id.toString() })
                return clients
            } catch (error) {
                console.log(error);
            }
        },
        getClient: async (_, { id }, ctx) => {
            //check if client exists
            const client = await Client.findById(id);

            if (!client) {
                throw new Error("Client not found")
            }

            //Seller who creates the client can see it

            if (client.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("Not authorized")
            }

            return client

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
        newProduct: async (_, { input }) => {
            try {
                const product = new Product(input);

                //store in db

                const result = await product.save()

                return result
            }
            catch (error) {
                console.log(error);
            }
        },
        updateProduct: async (_, { id, input }) => {
            //check if product exists
            let product = await Product.findById(id)

            if (!product) {
                throw new Error("Product not found")
            }

            //save in db

            product = await Product.findOneAndUpdate({ _id: id }, input, { new: true });
            return product
        },
        deleteProduct: async (_, { id }) => {
            //check if product exists
            let product = await Product.findById(id)

            if (!product) {
                throw new Error("Product not found")
            }

            //Delete product

            await Product.findOneAndDelete({ _id: id });

            return "Producto eliminado"
        },
        newClient: async (_, { input }, ctx) => {
            //check if client exists
            const { email } = input
            const client = Client.findOne({ email })
            if (!client) {
                throw new Error("Client already registered")
            }

            const newClient = new Client(input);

            //asign seller

            newClient.vendedor = ctx.usuario.id
            //save in db
            try {

                const result = await newClient.save();
                return result
            } catch (error) {
                console.log(error);
            }

        },
        updateClient: async (_, { id, input }, ctx) => {
            //check if client exists
            let client = await Client.findById(id);

            if (!client) {
                throw new Error("Client not found")
            }
            //check if vendor is who edits

            if (client.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("Not authorized")
            }

            //Save client

            client = await Client.findOneAndUpdate({ _id: id }, input, { new: true });
            return client
        },
        deleteClient: async (_, { id }, ctx) => {
            //check if client exists
            let client = await Client.findById(id);

            if (!client) {
                throw new Error("Client not found")
            }
            //check if vendor is who edits

            if (client.vendedor.toString() !== ctx.usuario.id) {
                throw new Error("Not authorized")
            }

            //delete client

            await Client.findOneAndDelete({_id : id})
            return 'Cliente eliminado'

        }

    }
}

module.exports = resolvers