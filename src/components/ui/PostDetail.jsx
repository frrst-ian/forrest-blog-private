const PostDetail = ({
  message,
  onBackClick,
  post,
  comments,
  onDeleteComment,
}) => {
  return (
    <div className="postDetail">
      {message && <div style={{ color: "green" }}>{message}</div>}
      <button onClick={onBackClick}>← Back to Posts</button>
      <h1>{post.title}</h1>
      <small>
        {new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </small>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="comments">
        <h3>Comments ({comments.length})</h3>
        {comments.map((c) => {
          return (
            <div key={c.id}>
              <p>{c.authorName}</p>
              <button onClick={() => onDeleteComment(c.id)}>Delete</button>
              <small>
                {new Date(c.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </small>
              <p>{c.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostDetail;
