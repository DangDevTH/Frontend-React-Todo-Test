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

const updateCommentDocument = gql`
  mutation CreateTask($comment_id: Int!, $comment: String!) {
    updateComment(input: { 
        comment_id: $comment_id, comment: $comment
    }) 
      @rest(type: "Comments", path: "/comments", method: "PATCH") {
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

export const useUpdateComment = () => {
  const [updateComment, { data, loading, error }] = useMutation(updateCommentDocument, {
    update(cache, { data }) {
        const existingComments = cache.readQuery<CommentData>({
          query: getCommentsByTaskIdDocument,
          variables: { taskId: data.updateComment.task.task_id },
        });
  
        if (existingComments && data) {
            const updatedComment = data.updateComment;
  
            const updatedComments = existingComments.comments.data.map((comment) =>
                comment.comment_id === updatedComment.comment_id ? updatedComment : comment
            );
  
          cache.writeQuery({
            query: getCommentsByTaskIdDocument,
            variables: { taskId: data.updateComment.task.task_id },
            data: {
                comments: {
                    data: updatedComments,
                }
            },
          });
        }
      },
  });

  return { updateComment, data, loading, error };
};
