import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Helmet } from "react-helmet-async";


const LikedPosts = () => {
    const { data: currentUser } = useGetCurrentUser();

    if (!currentUser)
    return (
        <div className="flex-center w-full h-full">
            <Loader />
        </div>
    );

    return (
    <>
        <Helmet>
            <title>Instagram-Clone | LikedPosts</title>
            <meta name="description" content="Instagram-Clone"/>
        </Helmet>

        {currentUser.liked.length === 0 && (
            <p className="text-light-4">No liked posts</p>
        )}

        <GridPostList posts={currentUser.liked} showStats={false} />
    </>
    );
};

export default LikedPosts