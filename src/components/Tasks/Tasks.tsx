import { ReactElement, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Badge,
  Blockquote,
  Button,
  ButtonGroup,
  Kbd,
  Modal,
  Textarea,
} from "flowbite-react";
import { useGetMyTaskById } from "../../hooks/useGetTaskId";
import { useCreateComment } from "../../hooks/useCreateComment";
import ToastAlerts from "../Alerts/ToastAlerts";
import { useGetCommentsByTaskId } from "../../hooks/useGetCommentByTaskId";
import { useReactiveVar } from "@apollo/client";
import { userIdVar } from "../../constants/all-makevar";
import FormUpdateComment from "./MyTasks/Actions/FormUpdateComment";
import { useDeleteComment } from "../../hooks/useDeleteComment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface IComment {
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

const Tasks = (): ReactElement => {
  const { id } = useParams();
  const { data, loading, error } = useGetMyTaskById(Number(id));
  const [comment, setComment] = useState<string>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const {
    createComment,
    data: createCommentData,
    error: commentError,
    loading: commentLoading,
  } = useCreateComment();
  const { data: getCommentsByTaskIdData, loading: getCommentsByTaskIdLoading } =
    useGetCommentsByTaskId(Number(id));
  const isUserId = useReactiveVar(userIdVar);
  const {
    deleteComment,
    data: deleteCommentData,
    loading: deleteCommentLoading,
    error: deleteCommentError,
  } = useDeleteComment(Number(id));

  const formatDate = (dateString: string | Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  if (loading) return <div className="mt-10 text-center">Loading...</div>;
  if (!data?.getMyTaskById?.user?.username || error)
    return <div className="mt-10 text-center">ไม่พบข้อมูล</div>;

  const handleCreateComment = async () => {
    await createComment({ variables: { task_id: Number(id), comment } });
    setComment("");
  };

  const handleDeleteTask = async (id: number) => {
    await deleteComment({
      variables: { id: id },
    });
    setOpenDeleteModal(false);
  };

  return (
    <div className="mt-10 flex w-full justify-center">
      <div className="flex w-full max-w-4xl flex-col justify-center rounded-lg border border-gray-300 p-6 shadow-lg dark:bg-gray-800">
        <figure className="max-w-screen-md">
          <div className="mb-2 flex items-center font-semibold text-gray-900 dark:text-white">
            เรื่อง {data.getMyTaskById.title}
            <cite className="pl-3 text-sm font-thin text-gray-500 dark:text-gray-400">
              วันที่ {data.getMyTaskById.created_at.split("T")[0]}
            </cite>
          </div>

          <Kbd
            className={`mb-4 ${
              data.getMyTaskById.priority === "medium" &&
              "text-yellow-300 dark:text-yellow-300"
            }  
              ${
                data.getMyTaskById.priority === "low" &&
                "text-green-500 dark:text-green-500"
              } 
              ${
                data.getMyTaskById.priority === "high" &&
                "text-red-500 dark:text-red-500"
              }`}
          >
            ความสำคัญ {data.getMyTaskById.priority}
          </Kbd>
          <Blockquote className="mt-4">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.getMyTaskById.description}
            </p>
          </Blockquote>
          <figcaption className="mt-6 flex items-center space-x-3">
            <div className="flex items-center divide-x-2 divide-gray-300 dark:divide-gray-700">
              <cite className="pr-3 font-medium text-gray-900 dark:text-white">
                {data.getMyTaskById.user.username}
              </cite>
              {data.getMyTaskById.user.user_id === isUserId && (
                <Badge color="success">คุณ</Badge>
              )}
              <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">
                กำหนดส่ง: {data.getMyTaskById.due_date}
              </cite>
            </div>
          </figcaption>
        </figure>
        <hr className="mb-5 mt-5 border-gray-300 dark:border-gray-600" />
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
            แสดงความคิดเห็น
          </label>
          <Textarea
            placeholder="เขียนความคิดเห็นของคุณ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full"
          />
          <Button
            onClick={handleCreateComment}
            className="mt-3"
            disabled={!comment.trim() || commentLoading}
          >
            ส่งความคิดเห็น
          </Button>
        </div>
        {getCommentsByTaskIdLoading ? (
          <div>กำลังโหลด</div>
        ) : (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              ความคิดเห็น (
              {getCommentsByTaskIdData?.comments?.countComment ?? 0})
            </h2>
            {getCommentsByTaskIdData?.comments?.data.length > 0 ? (
              [...getCommentsByTaskIdData.comments.data]
                .sort((cA, cB) => {
                  if (!cA.created_at) return -1;
                  return (
                    new Date(cA.created_at).getTime() -
                    new Date(cB.created_at).getTime()
                  );
                })
                .map((c: IComment, index: number) => (
                  <>
                    <ul className="mt-2 space-y-2" key={index}>
                      <li className="rounded-lg bg-gray-100 p-3 text-gray-900 dark:bg-gray-700 dark:text-white">
                        <figcaption>
                          <div className="flex flex-col">
                            <cite className="font-normal text-gray-900 dark:text-white">
                              {c.comment}
                            </cite>
                          </div>
                          <div className="flex items-center divide-x-2 divide-gray-300 dark:divide-white">
                            <cite className="pr-2 font-medium text-gray-900 dark:text-white">
                              {c.user.username}
                            </cite>
                            {c.user.user_id === isUserId && (
                              <Badge color="success">คุณ</Badge>
                            )}
                            <cite className="ml-2 pl-3 text-sm text-gray-500 dark:text-gray-400">
                              เวลา: {formatDate(c.created_at)}
                              {c.user.user_id === isUserId && (
                                <ButtonGroup className="ml-2">
                                  <FormUpdateComment id={c.comment_id} />
                                  <button
                                    onClick={() => setOpenDeleteModal(true)}
                                    className="pl-2 font-medium text-red-500 hover:underline dark:text-red-500"
                                  >
                                    ลบ
                                  </button>
                                </ButtonGroup>
                              )}
                            </cite>
                          </div>
                        </figcaption>
                      </li>
                    </ul>

                    <Modal
                      show={openDeleteModal}
                      size="md"
                      onClose={() => setOpenDeleteModal(false)}
                      popup
                    >
                      <Modal.Header />
                      <Modal.Body>
                        <div className="text-center">
                          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            คุณต้องการลบความคิดเห็นนี้ ?
                          </h3>
                          <div className="flex justify-center gap-4">
                            <Button
                              color="failure"
                              disabled={deleteCommentLoading}
                              onClick={async () =>
                                handleDeleteTask(c.comment_id!)
                              }
                            >
                              ลบ
                            </Button>
                            <Button
                              color="gray"
                              onClick={() => setOpenDeleteModal(false)}
                            >
                              ยกเลิก
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </>
                ))
            ) : (
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                ยังไม่มีความคิดเห็น
              </p>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-4 z-50">
        {createCommentData?.createComment?.comment && (
          <ToastAlerts status={"success"} message={"แสดงความคิดเห็นแล้ว"} />
        )}
        {commentError && (
          <ToastAlerts status={"error"} message={"เกิดข้อผิดพลาด"} />
        )}
      </div>

      <div className="fixed bottom-4 left-4 z-50">
        {deleteCommentData && (
          <ToastAlerts
            status={"success"}
            message={deleteCommentData.deleteComment.message}
          />
        )}
        {deleteCommentError && (
          <ToastAlerts status={"error"} message={"เกิดข้อผิดพลาด"} />
        )}
      </div>
    </div>
  );
};

export default Tasks;
