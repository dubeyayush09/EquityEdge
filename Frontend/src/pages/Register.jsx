import AuthForm from "../components/AuthForm";
import axios from "axios";

const Register = () => {
  const handleRegister = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );
      console.log("Registered", res.data);
    } catch (err) {
      console.error("Registration failed", err.response?.data?.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-100">
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
