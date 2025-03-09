import { gql, useQuery } from "@apollo/client";

export const getCommentsByTaskIdDocument = gql`
  query GetCommentsByTaskId($taskId: Int!) {
    comments(taskId: $taskId)
      @rest(type: "CommentsResponse", path: "/comments/?taskId={args.taskId}&skip=0", method: "GET") {
      data @type(name: "Comments") {
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
      countComment
    }
  }
`;

const useGetCommentsByTaskId = (taskId: number) => {
  return useQuery(getCommentsByTaskIdDocument, {
    fetchPolicy: "cache-and-network",
    variables: { taskId },
  });
};

export { useGetCommentsByTaskId };
