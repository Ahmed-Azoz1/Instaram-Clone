import { useEffect } from "react";
import { Link, NavLink,useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {

    const {mutate:signOut,isSuccess} = useSignOutAccount();

    const {pathname} = useLocation();

    const navigate = useNavigate();

    const {user} = useUserContext();

    useEffect(()=>{
        if(isSuccess) navigate(0);
    },[isSuccess])


    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                <Link className="flex gap-3 items-center" to='/'>
                    <img width={170} height={36} src="/assets/images/logo.svg" alt="logo" />
                </Link>

                <Link className="flex gap-3 items-center" to={`/profile/${user.id}`}>
                    <img className="h-14 w-14 rounded-full" src={user.imageUrl || '/assets/images/profile.webp'} alt="profile" />
                    <div className="flex flex-col">
                        <p className="body-bold">
                            {user.name}
                        </p>
                        <p className="small-regular text-light-3">
                            @{user.username}
                        </p>
                    </div>
                </Link>

                <ul className="flex flex-col gap-6">
                    {
                        sidebarLinks.map((link:INavLink)=>{
                            const isActive = pathname === link.route;
                            return(
                            
                            <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                                <NavLink className='flex gap-4 p-4 items-center' to={link.route} >
                                    <img className={`group-hover:invert-white ${isActive && 'invert-white'}`} src={link.imgURL} alt={link.label} />
                                    {link.label}
                                </NavLink>
                            </li>
                        )
                    })
                    }
                </ul>

            </div>

            <Button onClick={()=>signOut()} variant='ghost' className="shad-button_ghost">
                <img src="/assets/icons/logout.svg" alt="logout" />
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
        </nav>
    )
}

export default LeftSidebar






    