import { createContext, useState, useEffect, Children } from "react";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);

    useEffect(()=>{
        const storedUser=localStorage.getItem("user");
        const token=localStorage.getItem("token");

        if(storedUser && token)
        {
            setUser(JSON.parse(storedUser))
        }
    },[])
    const logout=()=>{
        localStorage.removeItem('token');
        // console.log("token removed from local storage")
        localStorage.removeItem('user');
        // console.log("user removed from local storage")
        setUser(null)
    }
    return (
        <AuthContext.Provider value={{user,setUser,logout}}>
            {children}
        </AuthContext.Provider>
    );
};