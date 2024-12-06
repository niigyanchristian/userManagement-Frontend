import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchOrganizations } from "../store/thunks";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useFetchData } from "../hooks/useFetchData";
import Loading from "../components/Loading";
import SideBar from "../components/sideBar";
import MainBody from "../components/MainBody";

const Layout = () => {
  const { organizations, loading, error } = useAppSelector(
    (state: RootState) => state.organizations
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orgId } = useParams();

  useFetchData(orgId);

  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if (error === "401" || error === "403") navigate("/login");
  }, [error, navigate]);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  if (loading) return <Loading />;

  return (
    <div className="flex w-screen h-screen justify-end bg-custom-secondary">
      <SideBar isSidebarVisible={isSidebarVisible} />

      <MainBody
        error={error}
        isSidebarVisible={isSidebarVisible}
        organizations={organizations}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
};

export default Layout;
