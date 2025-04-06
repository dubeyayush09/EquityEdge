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
    return (
        <AuthContext.Provider value={{user,setUser}}>
            {children}
        </AuthContext.Provider>
    );
};