import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { formatDateString } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";




const PostDetails = () => {

    const {id} = useParams();
    const {data:post,isPending} = useGetPostById(id||'');
    const {user} = useUserContext();


    return (
        <div className="post_details-container">
            { isPending ? 
                <Loader /> :
                (
                    <div className="post_details-card">

                        <img src={post?.imageUrl} alt="post" className="post_details-img" />

                        <div className="post_details-info">

                            <div className="flex-between w-full">
                                <Link className="flex items-center gap-3" to={`/profile/${post?.creator.$id}`}>
                                    <img className="w-8 h-8 lg:w-12 lg:h-12 rounded-full" src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator" />

                                    <div className="flex flex-col">
                                        <p className="base-medium lg:body-bold text-light-1">
                                            {post?.creator.name}
                                        </p>

                                        <div className="flex-center gap-2 text-light-3">
                                            <p className="subtle-semibold lg:small-regular">{formatDateString(post?.$createdAt || '')}</p> - 
                                            <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex-center gap-4">
                                    <Link className={`${user.id !== post?.creator.$id && 'hidden'}`} to={`/update-post/${post?.$id}`}>
                                        <img width={24} height={24} src="/assets/icons/edit.svg" alt="edit" />
                                    </Link>
                                </div>

                            </div>

                        </div>

                    </div>
                )
            }
        </div>
    )
}

export default PostDetails