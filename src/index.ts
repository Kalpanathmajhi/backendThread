import express, { query } from "express"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';


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
    `, //Scema as string
        resolvers: {
            Query: {
                hello: () => `Hey there, I am a Graphql server`,
                say: (_, { name }: { name: String }) => `Hey ${name},How are you`
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