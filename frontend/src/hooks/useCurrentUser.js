import { useAuth } from "../context/AuthContext";

export default function useCurrentUser() {
  const { user } = useAuth();
  return user;
}
