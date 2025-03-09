import { ReactElement, useState, useEffect } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";

import { useGetCommentId } from "../../../../hooks/useGetCommentId";
import { useUpdateComment } from "../../../../hooks/useUpdateComment";
import ToastAlerts from "../../../Alerts/ToastAlerts";

const FormUpdateComment = ({ id }: { id: number }): ReactElement => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const { data, loading, error } = useGetCommentId(Number(id));
  const {
    updateComment,
    data: updateCommentData,
    loading: updateCommentLoading,
    error: updateCommentError,
  } = useUpdateComment();

  useEffect(() => {
    if (data) {
      setComment(data.getCommentId.comment);
    }
  }, [data]);

  console.log("updateCommentData", updateCommentData);

  const handleUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateComment({
      variables: {
        comment_id: id,
        comment,
      },
    }).then(async (res) => {
      if (res.data.updateComment) {
        handleCloseModal();
      }
    });
  };

  if (loading) {
    return <div>กำลังโหลด</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div>
      <button
        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        onClick={() => setOpenModal(true)}
      >
        แก้ไข
      </button>
      <Modal dismissible show={openModal} onClose={handleCloseModal}>
        <form onSubmit={handleUpdateComment}>
          <Modal.Body>
            <div className="space-y-1">
              <div className="mt-2 block">
                <Label htmlFor="title" value="ความคิดเห็น" />
              </div>
              <TextInput
                id="title"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="แสดงความคิดเห็น..."
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              disabled={!comment.trim() || updateCommentLoading}
            >
              อัพเดต
            </Button>
            <Button color="gray" onClick={handleCloseModal}>
              ยกเลิก
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <div className="fixed bottom-4 left-4 z-50">
        {updateCommentData && (
          <ToastAlerts status={"success"} message={"อัปเดตสำเร็จ"} />
        )}
        {updateCommentError && (
          <ToastAlerts status={"error"} message={"เกิดข้อผิดพลาดในการอัปเดต"} />
        )}
      </div>
    </div>
  );
};

export default FormUpdateComment;
