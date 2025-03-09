import { gql, useQuery } from "@apollo/client";

const getCommentIdDocument = gql`
  query GetMyTaskById($id: ID!) {
    getCommentId(id: $id) @rest(type: "Comments", path: "/comments/{args.id}", method: "GET") {
      comment_id
      comment
      created_at
      updated_at
      user {
        user_id
        username
      }
      task {
        task_id
      }
    }
  }
`;

const useGetCommentId = (id: number) => {
    return useQuery(getCommentIdDocument, {
      'fetchPolicy': 'network-only',
      variables: { id },
    });
  };
  
  
export { useGetCommentId };
