const bodyParser = require('body-parser');
const server = require('express')();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const users = require('./routes/users.js');
const multer = require('multer')

const graphqlHTTP = require('express-graphql');
const { typeDefs } = require('./schema')
const { resolvers } = require('./resolvers')
const upload = multer({ dest: __dirname + '/uploadedFiles'});

const PORT = 5000;

server.set('secretKey', 'nodeGraphQL');
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/users', users);

server.use('/graphql', graphqlHTTP({
  schema: typeDefs,
  rootValue: resolvers,
  graphiql: true,
}));

server.use((request, response) => {
  response.status(404).send('Nope, nothing here.')
})     

server.listen(PORT, function() {
  console.log(`Express server is running on http://localhost:${PORT} in ${server.get('env')} mode.`);
});

server.use((req, res, next) => {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), (err, decoded) => {
    if (err) {
      res.status(401).send({ status: 'error', message: err.message })
    } else {
      next()
    }
  })
})
