import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Helmet } from "react-helmet-async";


const Home = () => {

    const {data:posts,isPending:isPostLoading,isError:isErrorPosts} = useGetRecentPosts(); 


    return (
    <>
        <Helmet>
            <title>Instagram-Clone | Home</title>
            <meta name="description" content="Instagram-Clone"/>
        </Helmet>

        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

                    {
                        isPostLoading && !posts ? 
                        (
                            <Loader />
                        ) :
                        (
                            <ul className="flex flex-1 flex-col gap-9 w-full">
                                {
                                    posts?.documents.map((post:Models.Document,id)=>{
                                        return(
                                            <PostCard post={post} key={id}/>
                                        )
                                    })
                                }
                            </ul>
                        )
                    }

                </div>
            </div>
        </div>
        </>
    )
}

export default Home