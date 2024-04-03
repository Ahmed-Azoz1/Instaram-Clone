import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";


const Topbar = () => {

    const {mutate:signOut,isSuccess} = useSignOutAccount();

    const navigate = useNavigate();

    const {user} = useUserContext();

    useEffect(()=>{
        if(isSuccess) navigate(0);
    },[isSuccess])

    return (
        <section className='topbar'>

            <div className='flex-between py-4 px-5'>
                <Link className='flex gap-3 items-center' to='/'>
                    <img src="/assets/images/logo.svg" width={130} height={325} alt="logo" />
                </Link>

                <div className="flex gap-4">
                    <Button onClick={()=>signOut()} variant='ghost' className="shad-button_ghost">
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link className="flex-center gap-3" to={`/profile/${user.id}`}>
                        <img className="h-8 w-8 rounded-full" src={user.imageUrl || '/assets/images/profile.webp'} alt="user-photo" />
                    </Link>
                </div>

            </div>
            
        </section>
    )
}

export default Topbar