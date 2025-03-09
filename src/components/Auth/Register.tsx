import { Button, Label, TextInput } from "flowbite-react";
import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router";
import { useRegister } from "../../hooks/useRegister";
import ToastAlerts from "../Alerts/ToastAlerts";


interface ErrorType {
  result: {
    message: string;
    error: string;
    statusCode: number;
  }
}

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Register = (): ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(false);
  const [toastError, setToastError] = useState<string>('');

  const { register, data: userData,loading, error } = useRegister();

  useEffect(() => {
    setPasswordValid(passwordPattern.test(password));
    setPasswordMatch(password === passwordConfirm); 
  }, [password, passwordConfirm]);

  const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
      await register({ variables: { username, email, password, passwordConfirm } }).then(async (res)=> {
        if(res.data.register.statusCode == 201){
          await sleep(3000);
          setEmail('');
          setPassword('');
          setPasswordConfirm('');
          setUsername('');
        }
      });
  };
  
  useEffect(() => {
    const newError = error?.networkError as ErrorType | undefined;
    if (newError && newError.result) {
      if (newError.result.statusCode === 409) {
        setToastError(newError.result.message);
      } else {
        setToastError(newError.result.message[0]);
      }
    }
  }, [error])

  return (
    <div className="flex justify-center ">
      <form className="flex w-96 max-w-lg flex-col gap-4 rounded-lg border border-gray-300 p-6 shadow-lg dark:bg-gray-800">
        <div className="text-center dark:text-white">
          สมัครสมาชิก
        </div>
        <div>
          <div className="mb-2 block text-black dark:text-white">
            <Label htmlFor="username" value="ชื่อ" />
          </div>
          <TextInput id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required />
        </div>
        <div>
          <div className="mb-2 block text-black dark:text-white">
            <Label htmlFor="email1" value="อีเมล" />
          </div>
          <TextInput id="email1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@flowbite.com" required />
        </div>
        <div>
          <div className="mb-2 block text-black dark:text-white">
            <Label htmlFor="password" value="รหัสผ่าน" />
          </div>
          <TextInput
          id="password"
          type="password"
          pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          title="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวใหญ่ (A-Z), ตัวเลข (0-9), และอักขระพิเศษ (@$!%*?&)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required />
          {password && !passwordValid && (
            <p className="text-sm text-red-500">
              รหัสผ่านต้องมีอย่างน้อย 8 ตัว ประกอบด้วยตัวใหญ่ (A-Z), ตัวเล็ก (a-z), ตัวเลข (0-9), และอักขระพิเศษ (@$!%*?&)
            </p>
          )}

        </div>
        <div>
          <div className="mb-2 block text-black dark:text-white">
            <Label htmlFor="passwordConfirm" value="ยืนยันรหัสผ่าน" />
          </div>
          <TextInput
          id="passwordConfirm"
          type="password" 
          minLength={8} 
          pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          title="รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวใหญ่ (A-Z), ตัวเลข (0-9), และอักขระพิเศษ (@$!%*?&)"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required />
            {passwordConfirm && !passwordMatch && (
            <p className="text-sm text-red-500">รหัสผ่านไม่ตรงกัน</p>
          )}
          {passwordMatch && passwordValid && (
            <p className="text-sm text-green-500">รหัสผ่านตรงกัน</p>
          )}
        </div>
        <div className="flex items-center gap-2">
        <Link to="/login" className="text-cyan-600 hover:underline dark:text-cyan-500">
          คุณมีบัญชีผู้ใช้แล้ว?
        </Link>
        </div>
        <Button
          type="submit"
          onClick={handleRegister}
          disabled={
            (!password.trim() || passwordConfirm.trim() || !email.trim()) 
            && !passwordValid || !passwordMatch || loading}
        >{loading ? 'Registering...':'Register'}</Button>
      </form>
      <div className="fixed bottom-4 left-4 z-50">
      {userData && (
        <ToastAlerts status={"success"} message={userData.register.message} />
      )}
      {error && (
        <ToastAlerts status={"error"} message={toastError} />
      )}
    </div>
    </div>
  )
}

export default Register;
