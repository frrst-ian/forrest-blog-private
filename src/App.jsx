import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import "./App.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    fetch("http://localhost:3000/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, content }),
    })
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
    <div className="createPost">
      <button onClick={handleBackClick}>← Back to Posts</button>
      {message && <div className="">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          required
        />

        <Editor
          apiKey={import.meta.env.VITE_API_KEY}
          init={{
            height: 400,
            menubar: false,
            plugins: [
              "anchor",
              "autolink",
              "charmap",
              "codesample",
              "emoticons",
              "link",
              "lists",
              "media",
              "searchreplace",
              "table",
              "visualblocks",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | " +
              "addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          }}
          value={content}
          onEditorChange={(newValue) => setContent(newValue)}
        />

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Creating post" : "Create Post"}
        </button>
      </form>
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setMessage("");

    fetch(`http://localhost:3000/admin/posts/${id}`, {
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
        setMessage(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleBackClick = () => {
    navigate("/admin/posts");
  };

  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:3000/admin/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
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
    <div className="postDetail">
      {message && <div style={{ color: "green" }}>{message}</div>}
      <button onClick={handleBackClick}>← Back to Posts</button>
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

  const handleNavigateCreatePost = () => {
    navigate("/admin/posts/new");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="postList">
      <button onClick={handleNavigateCreatePost}>Create post</button>
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
            data.error || `Error ${response.status}: Login Failed`,
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
        <Route path="/" element={<Navigate to="/admin/posts" replace />} />
        <Route path="/admin/posts" element={<PostList />} />
        <Route path="/admin/posts/:id" element={<PostDetail />} />
        <Route path="/admin/posts/new" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
