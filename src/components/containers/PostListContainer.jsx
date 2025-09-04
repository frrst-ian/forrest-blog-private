import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "../ui/PostList";
import {
  deletePost,
  getPosts,
  togglePostPublishStatus,
} from "../../services/PostService";

const PostListContainer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const togglePublishStatus = async (postId) => {
    const postToUpdate = posts.find((post) => post.id === postId);
    if (!postToUpdate) return;

    const newStatus = !postToUpdate.published;

    try {
      await togglePostPublishStatus(postId, newStatus);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, published: newStatus } : post,
        ),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeletePost = (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    ) {
      return; // Exit if user cancels
    }
    deletePost(postId)
      .then(async (response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        if (response.status === 204) {
          setPosts(posts.filter((post) => post.id !== postId));
          setMessage("Post deleted successfully!");
          setTimeout(() => setMessage(""), 3000); // Clear after 3 seconds
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `Failed to delete post`);
        }
      })
      .catch((err) => {
        setMessage(err.message);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found!");
      return;
    }

    getPosts(token)
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleNavigateCreatePost = () => {
    navigate("/admin/posts/new");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PostList
      posts={posts}
      onNavigateCreatePost={handleNavigateCreatePost}
      togglePublishStatus={togglePublishStatus}
      onDeletePost={handleDeletePost}
    />
  );
};

export default PostListContainer;
