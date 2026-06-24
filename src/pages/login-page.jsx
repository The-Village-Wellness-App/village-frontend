import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? <LoginForm /> : <RegisterForm />}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>
    </>
  );
}
