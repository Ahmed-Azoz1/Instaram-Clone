import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React,{ useState,useEffect } from "react";
import Loader from "./Loader";

type PostStatProps = {
    post:Models.Document;
    userId:string;
}


const PostStats = ({post,userId}:PostStatProps) => {


    const likesList = post.likes.map((user:Models.Document)=>user.$id)

    const [likes,setLikes] = useState(likesList);
    const [isSaved,setIsSaved] = useState(false);

    const {mutate:likePost} = useLikePost();
    const {mutate:savePost,isPending:isSavingPost} = useSavePost();
    const {mutate:deleteSavePost,isPending:isDeletingSaved} = useDeleteSavedPost();

    const {data:currentUser} = useGetCurrentUser();

    const savedPostRecord = currentUser?.save?.find((record:Models.Document)=>record.post.$id === post.$id);

    useEffect(()=>{
        setIsSaved(!!savedPostRecord)
    },[currentUser])


    const handleLikePost = (e:React.MouseEvent)=>{
        e.stopPropagation();
        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);
        if(hasLiked){
            newLikes = newLikes.filter((id)=>id !== userId)
        }else{
            newLikes.push(userId)
        }
        setLikes(newLikes);
        likePost({postId:post.$id,likesArray:newLikes})
    }


    const handleSavePost = (e:React.MouseEvent)=>{
        e.stopPropagation();
        

        if(savedPostRecord){
            setIsSaved(false);
            deleteSavePost(savedPostRecord.$id);
        }else{
            savePost({postId:post.$id,userId});
            setIsSaved(true);
        }
    }


    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img onClick={handleLikePost} className="cursor-pointer" width={20} height={20} src={checkIsLiked(likes,userId) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg' } alt="like" />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>

            <div className="flex gap-2">
                {isSavingPost || isDeletingSaved ? 
                    <Loader /> :
                (
                    <img onClick={handleSavePost} className="cursor-pointer" width={20} height={20} src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"} alt="save" />
                )
                }
            </div>
        </div>
    )
}

export default PostStats