const graphql = require("graphql");
const axios = require("axios");
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLSchema } = graphql;
const _ = require("lodash");

const db = {
    users:[
        {id:'23', firstName: 'Bill', age: 20, companyId: '1'},
        {id:'47', firstName: 'Samantha', age: 21, companyId: '2'}
    ],
    companies: [
        {id:'1', name: 'google', description: 'search'},
        {id:'2', name: 'apple', description: 'iphone'},
    ]
};
console.log(db);
//schema decribes the data structure
//tells how the user object looks like
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt}
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return _.find(db.users, {id: args.id});
            }
        }
        
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});