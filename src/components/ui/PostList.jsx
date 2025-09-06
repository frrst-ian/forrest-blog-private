import PostItemContainer from "../containers/PostItemContainer";
import "../../styles/components/PostList.css"

const PostList = ({
    posts,
    onNavigateCreatePost,
    togglePublishStatus,
    onDeletePost,
}) => {
    return (
        <div className="postList">
            <h1 className="postList_title">Ian Forrest's Blog Posts</h1>
            <button className="btn --btn-create-post" onClick={onNavigateCreatePost}>Create post</button>
            {posts.map((post) => {
                return (
                    <PostItemContainer
                        key={post.id}
                        post={post}
                        togglePublishStatus={togglePublishStatus}
                        onDeletePost={onDeletePost}
                    />
                );
            })}
        </div>
    );
};

export default PostList;
