import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import News from "./news";
import Users from "./users";
import PassCode from "./passcode";
import Login from "./Login";

const isAuthenticated = () => {
  return localStorage.getItem("accesstoken") !== null;
};

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const Root: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/passcode" element={<PassCode />} />

        <Route path="/" element={<PrivateRoute element={<Layout />} />}>
          <Route
            index
            element={
              <div className="flex justify-center items-center pt-10">
                <p className="text-gray-300">Select Organization</p>
              </div>
            }
          />
          <Route path="org/">
            <Route path=":orgId/users" element={<Users />} />
            <Route path=":orgId/news/" element={<News />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
