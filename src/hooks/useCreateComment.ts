import { gql, useMutation } from "@apollo/client";
import { getCommentsByTaskIdDocument } from "./useGetCommentByTaskId";

interface Comment {
  comment_id: number;
  comment: string;
  created_at: string | Date;
  updated_at: string | Date;
  user: {
    user_id: number;
    username: string;
  };
  task: {
    task_id: string;
  };
}

interface CommentData {
  comments: {
    data: Comment[];
    countComment: number;
  };
}

const createCommentDocument = gql`
  mutation CreateComment($task_id: Int!, $comment: String!) {
    createComment(input: { task_id: $task_id, comment: $comment })
      @rest(type: "Comments", path: "/comments", method: "POST") {
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

export const useCreateComment = () => {
  const [createComment, { data, loading, error }] = useMutation(createCommentDocument, {
    update(cache, { data }) {
      if (!data || !data.createComment) return;
      
      const newComment = data.createComment;

      const existingComments = cache.readQuery<CommentData>({
        query: getCommentsByTaskIdDocument,
        variables: { taskId: newComment.task.task_id },
      });

      if (existingComments) {
        cache.writeQuery({
          query: getCommentsByTaskIdDocument,
          variables: { taskId: newComment.task.task_id },
          data: {
            comments: {
              data: [newComment, ...existingComments.comments.data],
              countComment: existingComments.comments.countComment + 1,
            },
          },
        });
      }
    },
  });

  return { createComment, data, loading, error };
};
