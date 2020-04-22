const graphql = require("graphql");
const axios = require("axios");
const { GraphQLObjectType, GraphQLInt, GraphQLString,
    GraphQLList, GraphQLSchema, GraphQLNonNull } = graphql;
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

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: ()=>(
        {
            id: {type: GraphQLString},
            name: {type: GraphQLString},
            description: {type: GraphQLString},
            user: {
                type: new GraphQLList(UserType),
                resolve(parentValue, args){
                    console.log(parentValue, args);
                    return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(resp=> resp.data);
                }
            }
        }
    )
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args){
                console.log(parentValue, args);
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(resp=> resp.data );
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                //return _.find(db.users, {id: args.id});
                return axios.get(`http://localhost:3000/users/${args.id}`).then(resp=> resp.data );
            }
        },
        company: {
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                //return _.find(db.users, {id: args.id});
                return axios.get(`http://localhost:3000/companies/${args.id}`).then(resp=> resp.data );
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, {firstName, age, companyId}) {
                return axios.post(`http://localhost:3000/users`, {firstName, age, companyId}).then(resp=> resp.data );
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue,{id}) {
                return axios.delete(`http://localhost:3000/users/${id}`).then(resp=> resp.data );
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstName: {type: GraphQLString},
                age: {type: GraphQLInt},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args).then(resp=> resp.data );
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});