import { gql, useMutation } from "@apollo/client";
import { getMyTaskDocument } from "./useGetMyTask";

interface Task {
    task_id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    user: {
      user_id: number;
      username: string;
    };
  }
  
  interface MyTasksData {
    tasks: Task[];
  }

const createTaskDocument = gql`
  mutation CreateTask($task_id: Int!, $title: String!,
    $description: String!, $status: String!, $priority: String!,
    $due_date: String!
   ) {
    createTask(input: { 
        task_id: $task_id, title: $title, description: $description,
        status: $status, priority: $priority, due_date: $due_date
    }) 
      @rest(type: "Tasks", path: "/tasks", method: "POST") {
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

export const useCreateTask = () => {
  const [createTask, { data, loading, error }] = useMutation(createTaskDocument, {
    update(cache, { data }) {
        const existingTasks = cache.readQuery<MyTasksData>({ query: getMyTaskDocument });  
  
        if (existingTasks && data) {
          cache.writeQuery({
            query: getMyTaskDocument,
            data: {
              tasks: [...existingTasks.tasks, data.createTask], 
            },
          });
        }
      },
  });

  return { createTask, data, loading, error };
};
