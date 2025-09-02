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
      .then(async (response) => {
        const data = await response.json();

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
