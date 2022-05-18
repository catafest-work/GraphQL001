const graphql = require('graphql');
const _ = require('lodash');
const Author = require('../models/Author');
const Post = require('../models/Post');

const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
 } = graphql;

// bacause is connected to MongoDB 
/*
mutation {
	addAuthor(name: "catafest-work", description: "my working nickname is catafest-work!")
	{
	name
	}
}
*/
// const posts = [
//   { 
//     id:0,
//     title: 'This is my first post',
//     author: 'catafest-work' },
//   { 
//     id:1,
//     title: 'Post number #1',
//     author: 'mike'
//   }
// ];

// const authors = [
//   {
//     id: 0,
//     name: 'catafest-work', 
//     description: 'Hi, catafest !'
//   },
//   {
//     id: 1,
//     name: 'mike',
//     description: 'Hi, my name is Mike !'
//   }
// ];

const PostsType = new GraphQLObjectType({
  name: 'Posts',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    author: { type: GraphQLString},
    author_data: { 
      type: AuthorType,
      // resolve(parent, args) {
      //   return _.find(authors, (author) => {
      //     if(author.name == parent.author) {
      //       return author;
      //     }
      //   });
      // }

      resolve(parent, args) {
        return Author.find({ name: parent.author})
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
      //id: { type: GraphQLString }, // 
      name: { type: GraphQLString }, //
      posts: {
        type: new GraphQLList(PostsType),
        // resolve(parent, args) {
        //   var author_posts = [] ;
        //   _.find(posts , (post) => {
        //     if ( post.author == parent.name) {
        //       author_posts.push( post );
        //     }
        //   });
        // return author_posts;
        // }
        resolve(parent, args) {
          return Post.find({ author: parent.name })
        }
      }
    })
  })

/* // add data in database with mutation 
mutation {
  addPost (id:"2", title:"I learning GraphQL", author: "admin")
  {
  id, title, author
  }
}
*/

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPost: {
      type: PostsType,
      args: {
        id: { type: GraphQLString },
        title: { type: GraphQLString},
        author: { type: GraphQLString}
      },
      // resolve(parent, args) {
      //   posts.push({
      //     id: args.id,
      //     title: args.title,
      //     author: args.author
      //   });
      //   return _.find(posts, (post) => {
      //     if (post.id == args.id)
      //       {
      //         return post;
      //       }
      //   });
      resolve(parent, args) {
        let new_post = new Post({
          id: args.id,
          title: args.title,
          author: args.author
        });
        return new_post.save();
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        //id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          description: args.description
        });
        return author.save();
      }
    }
  }
}); 

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    author: {
      type:  AuthorType,
      args: {id: {type: GraphQLString}},
      resolve (parent, args) {
        // return author id 
        /*
        { 
          author(id:"6284b5033a86c0f6ce1f6234") 
          { name }
        }
        */
        return Author.findById(args.id); 
      }
    },
    authors: {
      type: new GraphQLList( AuthorType),
      resolve(parent, args) {
        //return authors; // ??
        return Author({}); // new return with empty object
      }
    },
    posts: {
      type: new GraphQLList( PostsType ),
      resolve(parent, args) {
        //return posts; // after mutation 
        return Post.find({}); // new return with empty object
        /*
        test with : 
        {
          posts {
            id,
            title
          } 
        }
        */
      }
    },
    post: {
      type: PostsType,
      args: { id: { type: GraphQLString } }, 
      resolve (parent, args) {
        return _.find(posts, (post) => {
          if (post.id == args.id)
            {
              //return post;
              return Post.findById(args.id);
            }
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation // mutation 
});
