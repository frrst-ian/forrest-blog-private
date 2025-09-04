import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePost from "../ui/CreatePost";
import { createPost } from "../../services/PostService";

const CreatePostContainer = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

  createPost(title,content)
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to create post");
        }

        setMessage("Post created successfully");
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

  return (
    <CreatePost
      onBackClick={handleBackClick}
      onSubmit={handleSubmit}
      title={title}
      setTitle={setTitle}
      message={message}
      content={content}
      setContent={setContent}
      submitting={submitting}
    />
  );
};

export default CreatePostContainer;
