const graphql = require('graphql');
const _ = require('lodash');

const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
 } = graphql;

const posts = [
  { 
    id:0,
    title: 'This is my first post',
    author: 'catafest-work' },
  { 
    id:1,
    title: 'Post number #1',
    author: 'mike'
  }
];

const author = [
  {
    id: 0,
    name: 'catafest-work', 
    description: 'Hi, catafest !'
  },
  {
    id: 1,
    name: 'mike',
    description: 'Hi, my name is Mike !'
  }
];
const PostsType = new GraphQLObjectType({
  name: 'Posts',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    author: { type: GraphQLString},
    author_data: { 
      type: AuthorType,
      resolve(parent, args) {
        return _.find(author, (author) => {
          if(author.name == parent.author) {
            return author;
          }
        });
      }
    }
  })
});

/* fix query : 
{
  posts {
    id
    title,
    author,
   	author_data {
      id,
    	name,
      posts {
        id,
        title
      }
  	}
  }
}
*/


const AuthorType = new GraphQLObjectType ({
    name: 'Author',
    fields: () => ({
      id: { type: GraphQLString }, //
      name: { type: GraphQLString }, //
      posts: {
        type: new GraphQLList(PostsType),
        resolve(parent, args) {
          var author_posts = [] ;
          _.find(posts , (post) => {
            if ( post.author == parent.name) {
              author_posts.push( post );
            }
          });
        return author_posts;
        }
      }
    })
  })


const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    authors: {
      type: new GraphQLList( AuthorType),
      resolve(parent, args) {
        return author; // ??
      }
    },
    posts: {
      type: new GraphQLList( PostsType ),
      resolve(parent, args) {
        return posts;
      }
    },
    post: {
      type: PostsType,
      args: { id: { type: GraphQLString } }, 
      resolve (parent, args) {
        return _.find(posts, (post) => {
          if (post.id == args.id)
            {
              return post;
            }
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
