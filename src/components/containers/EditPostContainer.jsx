import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditPost from "../ui/EditPost";
import { editPost, getPost } from "../../services/PostService";

const EditPostContainer = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getPost(id)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setLoading(false);
      })
      .catch((err) => {
        setMessage(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    editPost(id,title,content)
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to edit post");
        }

        setMessage("Post edited successfully");
        navigate("/admin/posts");
      })
      .catch((err) => {
        setMessage(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  const handleBackClick = () => {
    navigate("/admin/posts");
  };
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <EditPost
      onBackClick={handleBackClick}
      onSubmit={handleSubmit}
      message={message}
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      submitting={submitting}
    />
  );
};

export default EditPostContainer;
