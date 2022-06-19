# Book App Server

The project involved the creation of a server for the Book App Application. The server enables acces to data using graphQL. The server uses mongoose to connect to MongoDB atlas to store data.

## Features

- [] Connect to MongoDB database using mongoose
- [] Access of Author information using the author query
- [] Access Book information through the books query
- [] Add a book to the database using the addBook mutation
- [] Add author to the database using the AddAuthor mutation

## Dependencies

- Express.js
- Mongoose.js
- GraphQl
- Express-graphql

## Installation

```bash
npm install express mongoose graphql express-graphql concurrently
npm install -D nodemon
```

Concurrently enables the client to a access the data from the server easily. It runs the server and the client concurrently without the cors issue.

## GaphQl Types

### Book Type

Defines the data types for the book and the relationhip with the author resolve function

```js
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId)
      },
    },
  }),
})
```

### Author Type

Defines the data types for the author and the relationhip with the book resolve function

```js
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id })
      },
    },
  }),
})
```

### Queries

#### Book Query

The query to be used to access a book from the database

```js
Book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
      },
    },
```

The query to access all books from the database

```js
   Books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      },
    },
```

#### Author Query

The query to be used to access an Author from the database

```js
Author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      },
    },
```

The Query to acces all authors from the dtabase

```js
Authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      },
    },
```

### Mutations

Mutations are used to modify data in the database

#### Book Mutation

Add a book to the database

````js
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
    ```

````

#### Author Mutation

Add an author to the database

```js
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
```
