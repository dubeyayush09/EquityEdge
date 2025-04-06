import { useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard=()=>{
    const{user}=useContext(AuthContext);
    const navigate=useNavigate();

    useEffect(()=>{
        if(!user)
        {
            navigate("/login")
        }
    },[user])
    return (
        <div className="p-10 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome ,{user?.name}</h1>
            <p className="text-gray-600">Your personlized stock dashboard will appear here</p>
        </div>
    )
}

export default Dashboard;