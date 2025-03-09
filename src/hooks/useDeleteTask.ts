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
const deleteTaskDocument = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) @rest(type: "Task", path: "/tasks/{args.id}", method: "DELETE") {
      statusCode
      message
      task_id
    }
  }
`;

export const useDeleteTask = () => {
  const [deleteTask, { data, loading, error }] = useMutation(deleteTaskDocument, {
    update(cache, { data }) {
        if (data?.deleteTask) {
          const existingTasks = cache.readQuery<MyTasksData>({ query: getMyTaskDocument });
  
          if (existingTasks) {
            const newTasks = existingTasks.tasks.filter(
              (task: { task_id: number }) => task.task_id !== data.deleteTask.task_id
            );
  
            cache.writeQuery({
              query: getMyTaskDocument,
              data: {
                tasks: newTasks,
              },
            });
          }
        }
      },
  });
  return { deleteTask, data, loading, error };
};
