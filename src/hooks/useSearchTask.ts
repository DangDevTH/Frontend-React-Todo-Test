import { gql, useQuery } from "@apollo/client";

const seachTaskDocument = gql`
  query GetMyTaskById($title: String!) {
    seachTask(title: $title) @rest(type: "Tasks", path: "/tasks/search/?title={args.title}", method: "GET") {
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

const useSearchTask = (title: string) => {
    return useQuery(seachTaskDocument, {
      'fetchPolicy': 'cache-and-network',
      variables: { title },
    });
  };
  
  
export { useSearchTask };
