import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostDetail from "../ui/PostDetail";
import { deleteComment, getPost } from "../../services/PostService";

const PostDetailContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setMessage("");

    getPost(id)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found");
          } else if (response.status === 400) {
            throw new Error(data.message || "Invalid post ID");
          } else {
            throw new Error(data.message || "Failed to fetch post");
          }
        }

        return data;
      })
      .then((data) => {
        setPost(data);
        setComments(data.comments);
        setLoading(false);
      })
      .catch((err) => {
        setMessage(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBackClick = () => {
    navigate("/admin/posts");
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId)
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        if (response.status === 204) {
          setComments(comments.filter((comment) => comment.id !== commentId));
          setMessage("Comment deleted successfully!");
          setTimeout(() => setMessage(""), 3000); // Clear after 3 seconds
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `Failed to delete comment`);
        }
      })
      .catch((err) => {
        setMessage(err.message);
      });
  };

  if (loading) return <div>Loading...</div>;
  return (
    <PostDetail
      message={message}
      onBackClick={handleBackClick}
      post={post}
      comments={comments}
      onDeleteComment={handleDeleteComment}
    />
  );
};

export default PostDetailContainer;
