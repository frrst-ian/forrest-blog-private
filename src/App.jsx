import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`http://localhost:3000/admin/posts/${id}`,{
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
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
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBackClick = () => {
    navigate("admin/posts");
  };

  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:3000/admin/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        if (!response.ok)
          throw new Error(
            data.message || `Error ${response.status}: Failed to delete comment`
          );

        return data;
      })
      .then((data) => {
        setComments(comments.filter((comment) => comment.id !== commentId));
        return data;
      })
      .catch((err) => {
        setError(err);
      });
  };

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div>
        <button onClick={handleBackClick} style={{ marginBottom: "20px" }}>
          ← Back to Posts
        </button>
        <div
          style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "20px",
            borderRadius: "4px",
            border: "1px solid red",
            textAlign: "center",
          }}
        >
          <h2>Error</h2>
          <p>{error}</p>
          {/* Allow user to retry by refreshing the page */}
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "10px" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="postDetail">
      <button onClick={handleBackClick}>← Back to Posts</button>
      <h1>{post.title}</h1>
      <small>
        {new Date(post.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </small>
      <p>{post.content}</p>
      <div className="comments">
        <h3>Comments ({comments.length})</h3>
        {comments.map((c) => {
          return (
            <div key={c.id}>
              <p>{c.authorName}</p>
              <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
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
const PostItem = ({ post }) => {
  const navigate = useNavigate();
  const previewContent = post.content.split(".")[0] + ".";
  const handlePostClick = () => {
    navigate(`/admin/posts/${post.id}`);
  };
  return (
    <div className="postItem" onClick={handlePostClick}>
      <h1>{post.title}</h1>
      <p>{previewContent}</p>
    </div>
  );
};

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found!");
      return;
    }

    fetch("http://localhost:3000/admin/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="postList">
      {posts.map((post) => {
        return <PostItem key={post.id} post={post} />;
      })}
    </div>
  );
};

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || `Error ${response.status}: Login Failed`
          );
        }

        localStorage.setItem("token", data.token);
        navigate("/admin/posts");

        setSubmitting(false);

        return data;
      })
      .catch((err) => {
        setError(err.error);
        setSubmitting(false);
      });
  };

  return (
    <div className="login">
      {error && <div> {error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<LogIn />} />
        <Route path="/admin/posts" element={<PostList />} />
        <Route path="/admin/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
