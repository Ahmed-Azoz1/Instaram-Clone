import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";




export async function createUserAccount(user:INewUser){
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToDB(
            {
                accountId:newAccount.$id,
                name:newAccount.name,
                email:newAccount.email,
                username:user.username,
                imageUrl:avatarUrl,
            }
        )
        
        return newUser;
    } catch (error) {
        console.log(error)
        return error
    }
}


export async function saveUserToDB(user:{
    accountId:string;
    email:string;
    name:string;
    imageUrl:URL;
    username?:string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser;
    } catch (error) {
        console.log(error)
    }
}


export async function signInAccount(user:{email:string;password:string}){
    try {
        const session = await account.createEmailSession(user.email,user.password);
        return session;
    } catch (error) {
        console.log(error)
    }
}

// ============================== GET ACCOUNT ==============================
export async function getAccount() {
    try {
        const currentAccount = await account.get();
        
        return currentAccount;
    } catch (error) {
        console.log(error);
    }
}



// ============================== GET Current ACCOUNT ==============================

export async function getCurrentUser(){
    try {
        const currentAccount = await getAccount();
        if(!currentAccount) throw Error;
        const userId =  Query.equal("accountId",currentAccount.$id);
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [userId]
        );
        if(!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error)
        return null;
    }
}


// ============================== Log Out ACCOUNT ==============================
export async function signOutAccount(){
    try {
        const session = await account.deleteSession("current")
        return session
    } catch (error) {
        console.log(error)
    }
}



// ============================== Create Post ==============================

export async function createPost(post:INewPost){
    try {
        // Upload Image to storage
        const uploadedFile = await uploadFile(post.file[0])
        // Save Post to Database
        if(!uploadedFile) throw Error;
        // Get File Url
        const fileUrl = getFilePreview(uploadedFile.$id)
        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        }
        // Convert tags in an array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];;

        // Data
        const data = {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
        }
        // Create Post to Database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            data,
        );

        if(!newPost) {
            await deleteFile(uploadedFile.$id)
            throw Error;
        }

        return newPost;

    } catch (error) {
        console.log(error)
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
    );
    return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId:string){
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100,
        )
        return fileUrl
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFile(fileId:string){
    try {
        await storage.deleteFile(appwriteConfig.storageId,fileId);
        return {status:'good'}
    } catch (error) {
        console.log(error)
    }
}



// ============================== GET Post ==============================
export async function getRecentPosts(){
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'),Query.limit(20)]
    )
    if(!posts) throw Error;
    return posts;
}


// ============================== Like Post ==============================
export async function likePost(postId:string,likesArray:string[]){
    try {
        const data = {
            likes:likesArray
        }
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            data,
        )
        if(!updatedPost) throw Error;
        return updatedPost;

    } catch (error) {
        console.log(error);
    }
}


// ============================== Save Post ==============================
export async function savePost(postId:string,userId:string){
    try {
        const data = {
            user:userId,
            post:postId,
        }
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            ID.unique(),
            data,
        )
        if(!updatedPost) throw Error;
        return updatedPost;

    } catch (error) {
        console.log(error);
    }
}


// ============================== Delete Save Post ==============================
export async function deleteSavedPost(savedRecordId:string){
    try {
        
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            savedRecordId,
        )
        if(!statusCode) throw Error;
        return {status:'OK'};

    } catch (error) {
        console.log(error);
    }
}



// ============================== GET Post By Id ==============================
export async function getPostById(postId?:string){
    if(!postId) throw Error;
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
        );
        if (!post) throw Error;
        return post;
    } catch (error) {
        console.log(error)
    }
}


// ============================== Update Post ==============================
export async function updatePost(post:IUpdatePost){
    const hasFileToUpdate = post.file.length > 0;
    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId:post.imageId
        }

        if(hasFileToUpdate){
            // Upload Image to storage
            const uploadedFile = await uploadFile(post.file[0])
            // Save Post to Database
            if(!uploadedFile) throw Error;

            // Get File Url
            const fileUrl = await getFilePreview(uploadedFile.$id)
            if(!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw Error;
            }
            
            image = {...image,imageUrl:fileUrl,imageId:uploadedFile.$id}
        }


        // Convert tags in an array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];;
        // Data
        const data = {
            caption: post.caption,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            location: post.location,
            tags: tags,
        }
        // Create Post to Database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            data,
        );

        if(!updatedPost) {
            await deleteFile(post.imageId)
            throw Error;
        }

        return updatedPost;

    } catch (error) {
        console.log(error)
    }
}


// ============================== Delete Post ==============================
export async function deletePost(postId?:string,imageId?:string){
    if(!postId || !imageId) throw Error;
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return {status:'OK'}
    } catch (error) {
        console.log(error)
    }
}



// ============================== Ifinite Posts ==============================
export async function getInfinitePosts({pageParam}:{pageParam:number}){
    const queries:any[] = [Query.orderDesc('$updatedAt'),Query.limit(10)]

    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error)
    }
}


// ============================== Search Posts ==============================
export async function searchPosts(searchTerm:string){

    try {
        const searchItem = [Query.search('caption',searchTerm)]

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            searchItem,
        )

        if(!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error)
    }
}





// 
export async function getUserPosts(userId?: string) {
    if (!userId) return;
    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
        );

        if (!post) throw Error;

        return post;
    } catch (error) {
        console.log(error);
    }
}



// 
// ============================== GET USERS
export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) {
        queries.push(Query.limit(limit));
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        );
        if (!users) throw Error;
        return users;
    } catch (error) {
        console.log(error);
    }
}



// ============================== GET USER BY ID
export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
        );
        if (!user) throw Error;
        return user;
    } catch (error) {
        console.log(error);
    }
}


// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        };

        if (hasFileToUpdate) {
            // Upload new file to appwrite storage
            const uploadedFile = await uploadFile(user.file[0]);
            if (!uploadedFile) throw Error;

            // Get new file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

      //  Update user
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
            name: user.name,
            bio: user.bio,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            }
        );

      // Failed to update
        if (!updatedUser) {
            // Delete new file that has been recently uploaded
            if (hasFileToUpdate) {
            await deleteFile(image.imageId);
            }
            // If no new file uploaded, just throw error
            throw Error;
        }

      // Safely delete old file after successful update
        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}