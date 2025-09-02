const PostList = ({posts, onNavigateCreatePost,togglePublishStatus,onDeletePost}) => {
    return (
        <div className="postList">
            <button onClick={onNavigateCreatePost}>Create post</button>
            {posts.map((post) => {
                return (
                    <PostItem
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
