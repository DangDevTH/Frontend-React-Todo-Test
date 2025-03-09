import { gql, useQuery } from "@apollo/client";

const getTaskAllDocument = gql`
    query Tasks {
    tasks @rest(type: "Tasks", path: "/tasks", method: "GET") {
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

const useGetTaskAll = () => {
    return useQuery(getTaskAllDocument, {
      fetchPolicy: "network-only" 
    });
};
  
export { useGetTaskAll };

