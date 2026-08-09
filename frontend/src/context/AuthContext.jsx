import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();


function AuthProvider({ children }) {

    const [user, setUser] = useState(null);


    useEffect(() => {

        const getProfile = async () => {

            const token = localStorage.getItem("token");

            if(!token){
                return;
            }


            try {

                const response = await fetch(
                    "http://localhost:8000/api/users/profile",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );


                const data = await response.json();

                setUser(data);


            } catch(error){

                console.log(error);

            }

        };


        getProfile();

    }, []);


    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );

}


export default AuthProvider;