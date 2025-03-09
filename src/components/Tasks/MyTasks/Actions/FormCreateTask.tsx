import { ReactElement, useState } from "react";
import {
  Button,
  Label,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useCreateTask } from "../../../../hooks/useCreateTask";
import ToastAlerts from "../../../Alerts/ToastAlerts";
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

const FormCreateTask = (): ReactElement => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string>("");
  const [status, setStatus] = useState<StatusEnum | string>(StatusEnum.PENDING);
  const [priority, setPriority] = useState<PriorityEnum | string>(
    PriorityEnum.LOW,
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { createTask, data: CreateTaskData, loading, error } = useCreateTask();

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask({
      variables: {
        title,
        due_date: dueDate,
        status,
        priority,
        description,
      },
    }).then(async (res) => {
      console.log(res);
      handleCloseModal();
    });
  };

  const handleCloseModal = () => {
    setDescription("");
    setPriority(PriorityEnum.LOW);
    setStatus(StatusEnum.PENDING);
    setDueDate("");
    setTitle("");
    setOpenModal(false);
  };

  return (
    <div>
      <Button onClick={() => setOpenModal(true)}>เพิ่มงาน</Button>
      <Modal dismissible show={openModal} onClose={handleCloseModal}>
        <Modal.Header>เพิ่มงาน</Modal.Header>
        <form>
          <Modal.Body>
            <div className="space-y-1">
              <div className="mt-2 block">
                <Label htmlFor="title" value="หัวข้อ" />
              </div>
              <TextInput
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="หัวข้อ..."
                required
              />
            </div>
            <div className="space-y-1">
              <div className="mt-2 block">
                <Label htmlFor="description" value="รายละเอียด" />
              </div>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รายละเอียด..."
                required
                rows={4}
              />
            </div>
            <div className="space-y-1">
              <div className="mt-2 block">
                <Label htmlFor="due_date" value="วันกำหนดส่ง" />
              </div>
              <TextInput
                id="due_date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                form="yyyy-mm-dd"
                type="date"
                required
              />
            </div>

            <div className="flex space-x-4">
              <div className="mt-2 max-w-md flex-1">
                <div className="mb-2 block">
                  <Label htmlFor="status" value="เลือกสถานะของงาน" />
                </div>
                <Select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value={StatusEnum.PENDING}>pending</option>
                  <option value={StatusEnum.IN_PROGRESS}>in progress</option>
                  <option value={StatusEnum.COMPLETED}>completed</option>
                </Select>
              </div>

              <div className="bm-5 mt-2 max-w-md flex-1">
                <div className="mb-2 block">
                  <Label htmlFor="priority" value="เลือกความสำคัญของงาน" />
                </div>
                <Select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value={PriorityEnum.LOW}>low</option>
                  <option value={PriorityEnum.MEDIUM}>medium</option>
                  <option value={PriorityEnum.HIGH}>high</option>
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              disabled={
                !priority.trim() ||
                !status.trim() ||
                !dueDate.trim() ||
                !description.trim() ||
                !title.trim() ||
                loading
              }
              onClick={handleCreateTask}
            >
              บันทึก
            </Button>
            <Button color="gray" onClick={handleCloseModal}>
              ยกเลิก
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <div className="fixed bottom-4 left-4 z-50">
        {CreateTaskData && (
          <ToastAlerts status={"success"} message={"เพิ่มข้อมูลสำเร็จ"} />
        )}
        {error && <ToastAlerts status={"error"} message={"เกิดข้อผิดพลาด"} />}
      </div>
    </div>
  );
};

export default FormCreateTask;
