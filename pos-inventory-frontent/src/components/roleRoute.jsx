import { Navigate } from "react-router-dom";
import { getUser } from "../auth/authHelpers";

export default function RoleRoute({ allowed = [], children }) {
  const user = getUser();
  if (!user || !allowed.includes(user.role))
    return <Navigate to="/login" replace />;
  return children;
}
