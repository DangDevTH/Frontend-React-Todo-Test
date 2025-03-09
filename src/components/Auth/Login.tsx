import { Button, Label, TextInput } from "flowbite-react";
import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router";
import { useLogin } from "../../hooks/useLogin";
import ToastAlerts from "../Alerts/ToastAlerts";

interface ErrorType {
  result: {
    message: string;
    error: string;
    statusCode: number;
  }
}

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Login = (): ReactElement => {
  const { login, data: userData, loading, error } = useLogin();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [toastError, setToastError] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState(false);

  const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ variables: { email, password } }).then(async (res)=> {
      if(res.data.login.statusCode == 200){
        await sleep(2000);
        window.location.reload();
      }
    });
  };
    useEffect(() => {
      setPasswordValid(passwordPattern.test(password));
    }, [password]);

    useEffect(() => {
      const newError = error?.networkError as ErrorType | undefined;
      if (newError && newError.result) {
        if (newError.result.statusCode) {
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
          เข้าสู่ระบบ
        </div>
        <div>
          <div className="mb-2 block text-black dark:text-white">
            <Label htmlFor="email1" value="อีเมล" />
          </div>
          <TextInput
          id="email1"
          type="email"
          placeholder="name@flowbite.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
        </div>
        <div>
          <div className="mb-2 block text-black dark:text-white">
            <Label htmlFor="password1" value="รหัสผ่าน" />
          </div>
          <TextInput
           id="password1"
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           required />

          {password && !passwordValid && (
            <p className="text-sm text-red-500">
              รหัสผ่านต้องมีอย่างน้อย 8 ตัว ประกอบด้วยตัวใหญ่ (A-Z), ตัวเล็ก (a-z), ตัวเลข (0-9), และอักขระพิเศษ (@$!%*?&)
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
        <Link to="/register" className="text-cyan-600 hover:underline dark:text-cyan-500">
          คุณยังไม่มีบัญชีผู้ใช้หรือไม่?
        </Link>
        </div>
        <Button
          onClick={handleLogin}
          type="submit"
          disabled={
            !password.trim() || !email.trim() || !passwordValid || loading}
          >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="fixed bottom-4 left-4 z-50">
      {userData && (
        <ToastAlerts status={"success"} message={userData.login.message} />
      )}
      {error && (
        <ToastAlerts status={"error"} message={toastError} />
      )}
      </div>
    </div>
  );
};

export default Login;
