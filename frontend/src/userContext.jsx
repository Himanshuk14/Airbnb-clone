import axios from "axios";
import { useEffect, createContext, useState } from "react";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    async function getUser() {
      try {
        const res = await axios.get("/profile");
        setUser(res.data);
        setReady(true);
      } catch (e) {
        console.log("Error getting user", e);
      }
    }
    getUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
