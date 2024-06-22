import express, { query } from "express"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from "./lib/db";


async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000

    app.use(express.json())
    const gqlServer = new ApolloServer({
        typeDefs: `
    type Query {
    hello:String
    say(name:String):String 
    }
    type Mutation {
     createUser(firstName:String!, lastName:String!, email:String!,password:String!
     email:String!):Boolen
    }
    `,

        //Scema as string
        resolvers: {
            Query: {
                hello: () => `Hey there, I am a Graphql server`,
                say: (_, { name }: { name: String }) => `Hey ${name},How are you`
            },
            Mutation: {
                createUser: async(_, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                  await   prismaClient.user.create({
                       data:{
                        email,
                        password,
                        firstName,
                        lastName,
                        salt: "random_salt"
                       },
                    });
                    return true
                }
            }
        },

    })

    await gqlServer.start()
    //Start the gql server
    app.get('/', (req, res) => {
        res.json({ message: "Server is up and running" })
    });
    app.use("/graphql", expressMiddleware(gqlServer))
    app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}
init();