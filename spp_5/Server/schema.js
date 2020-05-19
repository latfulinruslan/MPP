var { buildSchema } = require('graphql');

module.exports.typeDefs = buildSchema(`
    type Note {
      id: ID!
      userId: Int!
      title: String!
      content: String!
      date: String!
      complete: Boolean!
    }

    input NoteInput {
      userId: Int!
      title: String!
      content: String!
      date: String!
    }

    type Query {
      getAllUserNotes(userId: Int!): [Note]!
      getNote(id: ID!): Note

    }

    type Mutation {
      addNote(data: NoteInput!): Note!
      updateNote(id: ID!, data: NoteInput!): Note
      deleteNote(id: ID!): Boolean
      completeNote(id: ID!, status: Boolean!): Boolean

    }
`);
