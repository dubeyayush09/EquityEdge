import AuthForm from "../components/AuthForm";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
    const {setUser}=useContext(AuthContext);
    const navigate=useNavigate();


  const handleLogin = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );
      const {token,user}=res.data;
    //   console.log("token received from login",token)
      localStorage.setItem("token",token);
      localStorage.setItem("user",JSON.stringify(user));
      setUser(user);
      toast.success("Login Successful!");
      navigate('/dashboard')


    //   console.log("Login success", res.data);
    } catch (err) {
        toast.error(err.response?.data?.message || "Login failed")
      console.error("Login failed", err.response?.data?.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-100">
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
