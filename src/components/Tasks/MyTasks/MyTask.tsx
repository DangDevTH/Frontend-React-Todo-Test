import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useGetMyTask } from "../../../hooks/useGetMyTask";
import FormCreateTask from "./Actions/FormCreateTask";
import { useDeleteTask } from "../../../hooks/useDeleteTask";
import ToastAlerts from "../../Alerts/ToastAlerts";
import { useEffect, useState } from "react";
import FormUpdateTask from "./Actions/FormUpdateTask";
import { Link } from "react-router";
import { HiOutlineExclamationCircle } from "react-icons/hi";

enum StatusEnum {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

enum PriorityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

interface ITask {
  task_id: number;
  title: string;
  description: string;
  status: StatusEnum;
  priority: PriorityEnum;
  due_date: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
  user: {
    user_id: number;
    username: string;
  };
}

interface ErrorType {
  result: {
    message: string;
    error: string;
    statusCode: number;
  };
}

const MyTask = () => {
  const { data: taskData, loading, error } = useGetMyTask();
  const {
    deleteTask,
    data: deleteTaskData,
    error: errorDeleteTask,
  } = useDeleteTask();
  const [toastError, setToastError] = useState<string>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    const newError = errorDeleteTask?.networkError as ErrorType | undefined;
    if (newError && newError.result) {
      if (newError.result.statusCode === 404) {
        setToastError(newError.result.message);
      } else {
        setToastError(newError.result.message[0]);
      }
    }
  }, [errorDeleteTask]);

  const handleDeleteTask = async (id: number) => {
    await deleteTask({
      variables: { id: id },
    });
    setOpenDeleteModal(false);
  };

  if (loading) {
    return <div>กำลังโหลด</div>;
  }

  if (error) {
    return <div>error</div>;
  }
  return (
    <div className="p-6">
      <div className="mb-3">
        <h3 className="text-x mb-1">งานของฉัน</h3>
        <br />
        <FormCreateTask />
      </div>
      <Table hoverable>
        <TableHead>
          <TableHeadCell>หัวข้อ</TableHeadCell>
          <TableHeadCell>รายละเอียด</TableHeadCell>
          <TableHeadCell>สถานะดำเนินการ</TableHeadCell>
          <TableHeadCell>ด่วน-สำคัญ</TableHeadCell>
          <TableHeadCell>กำหนดส่งถึงวันที่</TableHeadCell>
          <TableHeadCell>แก้ไข</TableHeadCell>
          <TableHeadCell>ลบ</TableHeadCell>
        </TableHead>
        {taskData?.tasks &&
          [...taskData.tasks]
            .sort((taskA, taskB) => {
              if (!taskA.created_at) return -1;
              return (
                new Date(taskB.created_at).getTime() -
                new Date(taskA.created_at).getTime()
              );
            })
            .map((t: ITask, index: number) => (
              <TableBody className="divide-y" key={`${index + 1}`}>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link to={`/tasks/${t.task_id}`}>
                      {t.title.slice(0, 8)}... คลิกดูงาน
                    </Link>
                  </TableCell>
                  <TableCell>{t.description.slice(0, 8)}...</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.priority}</TableCell>
                  <TableCell>
                    {new Date(t.due_date).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell>
                    <FormUpdateTask id={t.task_id} />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setOpenDeleteModal(true)}
                      className="font-medium text-red-500 hover:underline dark:text-red-500"
                    >
                      ลบ
                    </button>
                    <>
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
                              คุณต้องการลบข้อมูลนี้ ?
                            </h3>
                            <div className="flex justify-center gap-4">
                              <Button
                                color="failure"
                                onClick={async () =>
                                  handleDeleteTask(t.task_id)
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
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
      </Table>

      <div className="fixed bottom-4 left-4 z-50">
        {deleteTaskData && (
          <ToastAlerts
            status={"success"}
            message={deleteTaskData.deleteTask.message}
          />
        )}
        {errorDeleteTask && (
          <ToastAlerts status={"error"} message={toastError} />
        )}
      </div>
    </div>
  );
};

export default MyTask;
