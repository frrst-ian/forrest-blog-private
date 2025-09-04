import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/PostService";
import LogIn from "../ui/LogIn";

const LogInContainer = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    auth(email, password)
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/admin/posts");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <LogIn
        error={error}
        onSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        submitting={submitting}
      />
    </>
  );
};

export default LogInContainer;
