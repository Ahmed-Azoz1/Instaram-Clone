import {ReactNode, createContext,useContext,useEffect,useState} from 'react'


export const INITAL_USER = {
    id:'',
    name:'',
    username:'',
    email:'',
    imageUrl:'',
    bio:'',
};

const INITAL_STATE = {
    user:INITAL_USER,
    isLoading:false,
    isAuthenticated:false,
    setUser:()=>{},
    setIsAuthenticated:()=>{},
    checkAuthUser:async ()=> false as boolean,
}

const AuthContext = createContext<IContextType>(INITAL_STATE);


const AuthProvider = ({children}:{children:ReactNode}) => {

    const [user,setUser] = useState<IUser>(INITAL_USER)
    const [isLoading,setIsLoading] = useState(false);
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    const checkAuthUser = async ()=>{
        try {
            const currentAccount = await getCurrentUser();
        } catch (error) {
            console.log(error);
            return false;
        }finally{
            setIsLoading(false)
        }
    };

    const value = {
        user,
        setUser,
        isLoading,
        setIsLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext