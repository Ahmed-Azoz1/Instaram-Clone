import PostForm from "@/components/forms/PostForm"
import { Helmet } from "react-helmet-async"


const CreatePost = () => {
    return (
        <>
        <Helmet>
            <title>Instagram-Clone | CreatePost</title>
            <meta name="description" content="Instagram-Clone"/>
        </Helmet>

        <div className="flex flex-1">
            <div className="common-container">
                <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                    <img width={36} height={36} src="/assets/icons/add-post.svg" alt="addPost" />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
                </div>

                <PostForm action="Create"/>
            </div>
        </div>
        </>
    )
}

export default CreatePost