import "../../styles/components/LogIn.css"

const LogIn = ({
    error,
    onSubmit,
    email,
    setEmail,
    password,
    setPassword,
    submitting
}) => {
      return (
    <div className="login">
      {error && <div> {error}</div>}
      <form className="login" onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="btn --btn-login" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );

}

export default LogIn;