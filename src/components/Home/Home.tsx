import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import { Link } from "react-router";
import { useGetTaskAll } from "../../hooks/getTaskAll";
interface ITask {
  task_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
  user: {
    user_id: number;
    username: string;
  };
}


const Home = () => {
  const { data, loading , error } = useGetTaskAll();

  if (loading) {
    return <div>กำลังโหลด</div>;
  }

  if (error) {
    return <div>error</div>;
  }


  return (
    <div className="p-6">
      <div className="mb-3">
        <h3 className="text-x mb-1">งานทั้งหมด</h3>
        <br />
       {/* <FormCreateTask /> */}
      </div>
      <Table hoverable>
        <TableHead>
          <TableHeadCell>หัวข้อ</TableHeadCell>
          <TableHeadCell>รายละเอียด</TableHeadCell>
          <TableHeadCell>สถานะดำเนินการ</TableHeadCell>
          <TableHeadCell>ด่วน-สำคัญ</TableHeadCell>
          <TableHeadCell>กำหนดส่งถึงวันที่</TableHeadCell>
        </TableHead>
        {data?.tasks &&
          [...data.tasks]
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
                    <Link to={`/tasks/${t.task_id}`}>{t.title.slice(0,8)}... คลิกดูงาน</Link>
                  </TableCell>
                  <TableCell>{t.description.slice(0,8)}...</TableCell>
                  <TableCell>{t.status}</TableCell> 
                  <TableCell>{t.priority}</TableCell>
                  <TableCell>
                    {new Date(t.due_date).toISOString().split("T")[0]}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
      </Table>
    </div>
  )
}

export default Home;