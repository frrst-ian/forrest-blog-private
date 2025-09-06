import "../../styles/components/PostDetail.css";

import { CalendarFold, User ,Trash} from "lucide-react";

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
      <button className="btn" onClick={onBackClick}>
        ← Back to Posts
      </button>
      <h1 className="postDetail_title">{post.title}</h1>
      <div className="postDetail_date">
        <CalendarFold />
        <small>
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </small>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="comments">
        <h3>Comments ({comments.length})</h3>
        {comments.map((c) => {
          return (
            <div className="comments_item" key={c.id}>
              <div className="comment_author">
                <div className="comment_author">
                  <User />
                  <p>{c.authorName}</p>
                </div>
                <button
                  className="btn --btn-del --no-min-width"
                  onClick={() => onDeleteComment(c.id)}
                >
                  <Trash/>
                </button>
              </div>
              <div className="comment_date">
                <CalendarFold />
                <small className="comment_date">
                  {new Date(c.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </div>
              <p>{c.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostDetail;
