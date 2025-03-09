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

const deleteCommentDocument = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) @rest(type: "Comments", path: "/comments/{args.id}", method: "DELETE") {
      statusCode
      message
      comment_id
    }
  }
`;

export const useDeleteComment = (taskId: number) => {
    const [deleteComment, { data, loading, error }] = useMutation(deleteCommentDocument, {
      update(cache, { data }) {
        if (!data || !data.deleteComment) return;

          const existingComment = cache.readQuery<CommentData>({ query: getCommentsByTaskIdDocument ,
            variables: { taskId: taskId},
          });

          if (existingComment) {
            const newComments = existingComment.comments.data.filter(
              (comment) => comment.comment_id !== data.deleteComment.comment_id
            );
            cache.writeQuery({
              query: getCommentsByTaskIdDocument,
              variables: { taskId: taskId},
              data: {
                comments: {
                  data: newComments,
                  countComment: Math.max(existingComment.comments.countComment - 1, 0),
                },
              },
            });
        }
      },
    });

    return { deleteComment, data, loading, error };
};

  
