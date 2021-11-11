'use strict';
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('../resolvers/foods');

const typeDefs = `
type Query {

    foods:[Foods]
    foodsPagination(page: Int! , limit: Int!): [Foods]
    foodById(id: ID): Foods
}


type Foods {
    _id:ID
    name:String!
    price:Int!
    type:String!
    available:Boolean
}

type Mutation {
    postFood(input: FoodsInput):Foods
    updateFood(_id:ID, input:FoodsInputOp): Foods
    deleteFood(_id:ID): Foods
}
input FoodsInput {
    name:String!
    price:Int!
    type:String!
    available:Boolean
}

input FoodsInputOp {
    name:String
    price:Int
    type:String
    available:Boolean
}
`;

const foodsSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = foodsSchema;
