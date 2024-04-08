import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import UserCard from "@/components/shared/UserCard";
import { Helmet } from "react-helmet-async";



const AllUsers = () => {

    const { toast } = useToast();
    const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

    if (isErrorCreators) {
        toast({ title: "Something went wrong." });
        return;
    }

    return (
        <>
        
        <Helmet>
            <title>Instagram-Clone | AllUsers</title>
            <meta name="description" content="Instagram-Clone"/>
        </Helmet>

        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
                {isLoading && !creators ? (
                <Loader />
                ) : (
                <ul className="user-grid">
                    {creators?.documents.map((creator) => (
                    <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                        <UserCard user={creator} />
                    </li>
                    ))}
                </ul>
                )}
            </div>
        </div>
        </>
    )
}

export default AllUsers