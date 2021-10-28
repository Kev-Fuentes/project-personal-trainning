'use strict';
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('../resolvers/foods');

const typeDefs = `
type Query {
    foods:[Foods]
}
type Foods {
    id:ID
    name:String!
    price:Int!
    type:String!
    available:Boolean
}
type Mutation {
    createFood(input: FoodsInput):Foods
    updateFood(_id:ID, input:FoodsInput): Foods
    deleteFood(_id:ID): Foods
}
input FoodsInput {
    name:String!
    price:Int!
    type:String!
    available:Boolean
}

input FoodsInput {
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
