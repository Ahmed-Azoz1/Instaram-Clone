import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetPostById} from "@/lib/react-query/queriesAndMutations"
import { formatDateString } from "@/lib/utils";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";




const PostDetails = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const {data:post,isPending} = useGetPostById(id||'');
    const {user} = useUserContext();


    const { mutate: deletePost } = useDeletePost();


    const handleDeletePost = ()=>{
        deletePost({ postId: id, imageId: post?.imageId });
        navigate(-1);
    }


    return (
        <>
        <Helmet>
            <title>Instagram-Clone | PostDetails</title>
            <meta name="description" content="Instagram-Clone"/>
        </Helmet>

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

                                <div className="flex-center">
                                    <Link className={`${user.id !== post?.creator.$id && 'hidden'}`} to={`/update-post/${post?.$id}`}>
                                        <img width={24} height={24} src="/assets/icons/edit.svg" alt="edit" />
                                    </Link>

                                    <Button className={`ghost_details-delete_btn ${user.id !== post?.creator.$id && 'hidden'}`} onClick={handleDeletePost} variant='ghost' >
                                        <img width={24} height={24} src="/assets/icons/delete.svg" alt="delete" />
                                    </Button>
                                </div>

                            </div>

                            <hr className="border w-full border-dark-4/80" />

                            <div className="flex flex-col flex-1 w-full smal-medium lg:base-regular">
                                <p>{post?.caption}</p>
                                <ul className="flex gap-1 mt-2">
                                    {post?.tags?.map((tag:string)=>{
                                        return(
                                            <li key={tag} className="text-light-3">
                                                #{tag}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                            <div className="w-full">
                                <PostStats  post={post} userId={user.id}/>
                            </div>

                        </div>

                    </div>
                )
            }
        </div>
        </>
    )
}

export default PostDetails