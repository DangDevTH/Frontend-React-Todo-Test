import { gql, useQuery } from "@apollo/client";

const getTaskByIdDocument = gql`
  query GetMyTaskById($id: ID!) {
    getMyTaskById(id: $id) @rest(type: "Tasks", path: "/tasks/{args.id}", method: "GET") {
      task_id
      title
      description
      status
      priority
      due_date
      created_at
      updated_at
      user {
        user_id
        username
      }
    }
  }
`;

const useGetMyTaskById = (id: number) => {
    return useQuery(getTaskByIdDocument, {
      'fetchPolicy': 'cache-and-network',
      variables: { id },
    });
  };
  
  
export { useGetMyTaskById };
