import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";

import { UserContext } from "../userContext";
export default function LoginPage() {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  async function handleLogin(e) {
    e.preventDefault();
    try {
      console.log("Logging in user");
      const res = await axios.post("/users/login", {
        email,
        password,
      });
      setUser(res.data);
      console.log("User logged in successfully", res);

      alert("User logged in successfully");
      setRedirect(true);
    } catch (e) {
      alert("Invalid username or password");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-xl mx-auto" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to="/register">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
