import { getCurrentUser } from '@/lib/appwrite/api';
import { IUser } from '@/types';
import {ReactNode, createContext,useContext,useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';


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
    const navigate = useNavigate();

    const checkAuthUser = async ()=>{
        try {
            const currentAccount = await getCurrentUser();
            if(currentAccount){
                setUser({
                    id:currentAccount.$id,
                    name:currentAccount.name,
                    username:currentAccount.username,
                    email:currentAccount.email,
                    imageUrl:currentAccount.imageUrl,
                    bio:currentAccount.bio,
                })

                setIsAuthenticated(true);
                return true;
            }
            return false;
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

    useEffect(()=>{
        if( localStorage.getItem('cookieFallback') === '[]' || 
            localStorage.getItem('cookieFallback') === null ){
            navigate('/sign-in')
        }
        checkAuthUser();
    },[])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider


export const useUserContext = ()=>useContext(AuthContext)