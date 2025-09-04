const PostItem = ({
    onPostClick,
    post,
    previewContent,
    onDeletePost,
    togglePublishStatus,
}) => {
    return (
        <div className="postItem" onClick={onPostClick}>
            <h1>{post.title}</h1>
            <Link
                to={`/admin/posts/${post.id}/edit`}
                className="btn"
                onClick={(e) => e.stopPropagation()}
            >
                Edit
            </Link>
            <button
                className="btn"
                onClick={(e) => {
                    e.stopPropagation();
                    togglePublishStatus(post.id);
                }}
            >
                {post.published ? "Unpublish" : "Publish"}
            </button>

            <button
                className="btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onDeletePost(post.id);
                }}
            >
                Delete
            </button>
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
    );
};

export default PostItem;
