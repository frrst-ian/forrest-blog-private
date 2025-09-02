import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
  Link,
} from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import AppRoutes from "./Routes";
import Navigation from "./components/Navigation";
import "./App.css";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${id}`)
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

    fetch(`http://localhost:3000/admin/posts/${id}`, {
      method: "PUT",
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
  if (loading) return <div>Loading...</div>;

  return (
    <div className="editPost">
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
          {submitting ? "Editting post" : "Edit Post"}
        </button>
      </form>
    </div>
  );
};

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

const PostItem = ({ post, togglePublishStatus, onDeletePost }) => {
  const navigate = useNavigate();

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Find first non-empty block (p or div), skip headers
    const block = [...tempDiv.querySelectorAll("p, div")].find(
      (el) => !/^H[1-6]$/i.test(el.tagName) && el.textContent.trim(),
    );

    let text = block ? block.textContent.trim() : tempDiv.textContent.trim();
    if (!text) return "";

    // First sentence only
    let firstSentence =
      text
        .split(/[.!?]/)
        .map((s) => s.trim())
        .filter(Boolean)[0] || "";
    return firstSentence.length > 100
      ? firstSentence.substring(0, 100) + "..."
      : firstSentence + ".";
  };

  const previewContent = stripHtmlTags(post.content);
  const handlePostClick = () => {
    navigate(`/admin/posts/${post.id}`);
  };
  return (
    <div className="postItem" onClick={handlePostClick}>
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

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <Navigation />
        </header>
        <main className="main">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
