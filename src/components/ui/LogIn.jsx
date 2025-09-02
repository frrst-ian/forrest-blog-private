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
      <form onSubmit={onSubmit}>
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

}

export default LogIn;