import { Navigate } from "react-router-dom";

// Redirect to the landing page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
