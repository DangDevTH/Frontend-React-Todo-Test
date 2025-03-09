import { gql, useQuery } from "@apollo/client";

export const getMyTaskDocument = gql`
    query Tasks {
    tasks @rest(type: "Tasks", path: "/tasks/mytask", method: "GET") {
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

const useGetMyTask = () => {
    return useQuery(getMyTaskDocument, {
      fetchPolicy: "network-only" 
    });
};
  
export { useGetMyTask };

