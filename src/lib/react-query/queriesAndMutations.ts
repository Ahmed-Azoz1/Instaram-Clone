import {useQuery,useMutation,useQueryClient,useInfiniteQuery} from '@tanstack/react-query'
import { createUserAccount, deleteSavedPost, getCurrentUser, getRecentPosts, likePost, savePost, signInAccount, signOutAccount } from '../appwrite/api'
import { INewPost, INewUser } from '@/types'

import { QUERY_KEYS } from './queryKeys'
import { createPost } from '../appwrite/api'



export const useCreateUserAccount = ()=>{
    return useMutation({
        mutationFn:(user:INewUser)=>createUserAccount(user),
    })
}

export const useSignInAccount = ()=>{
    return useMutation({
        mutationFn:(user:{email:string;password:string;})=>signInAccount(user),
    })
}

export const useSignOutAccount = ()=>{
    return useMutation({
        mutationFn:signOutAccount
    })
}



// ============================== Create Post ==============================
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
    },
    });
};



// ============================== Get Post ==============================
export const useGetRecentPosts = ()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn:getRecentPosts,
    })
}



// ============================== Like Post ==============================
export const useLikePost = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:({postId,likesArray}:{postId:string;likesArray:string[]}) => likePost(postId,likesArray),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}


// ============================== Save Post ==============================
export const useSavePost = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:({postId,userId}:{postId:string;userId:string}) => savePost(postId,userId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}


// ============================== Delete Saved Post ==============================
export const useDeleteSavedPost = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(savedRecordId:string) => deleteSavedPost(savedRecordId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}


// ============================== Delete Saved Post ==============================
export const useGetCurrentUser = ()=>{

    return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn:getCurrentUser,
        
    })
}