const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = graphql;

const Book = require("../models/bookSchema");
const Author = require("../models/authorSchema");

let booksArray = [
  { name: "Valhala", genre: "history", id: "1", authorId: "1" },
  { name: "Star treck", genre: "Sci-fi", id: "2", authorId: "2" },
  { name: "Universe", genre: "nature", id: "3", authorId: "3" },
  { name: "Universe Reloaded", genre: "nature", id: "4", authorId: "3" },
];

let authorsArray = [
  { name: "Breda", age: 32, id: "1" },
  { name: "Spark", age: 35, id: "2" },
  { name: "Fredrick", age: 43, id: "3" },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
        // return authorsArray.find((item) => item.id === parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
        // return booksArray.filter((item) => item.authorId === parent.id);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
        // return booksArray.find((item) => item.id === args.id);
      },
    },
    Author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
        // return authorsArray.find((item) => item.id === args.id);
      },
    },
    Books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
        // return booksArray;
      },
    },
    Authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
        // return authorsArray;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
