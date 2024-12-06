import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
import { memo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import { useAppSelector } from "../hooks/hooks";
import { RootState } from "../store/store";
import { createSelector } from "@reduxjs/toolkit";
import {
  deleteUser,
  handleResend,
  handleRevokeInvite,
  removeOrganizationUser,
} from "../api/api";
import Modal from "../components/Modal";
import InviteForm from "../components/InviteForm";
import { InvitesInfo } from "../types/interfaces";
import { useFetchData } from "../hooks/useFetchData";

const selectOrganizationState = createSelector(
  (state: RootState) => state.organizations,
  (organizations) => ({
    organizationUsers: organizations.organizationUsers,
    loading: organizations.loading,
    error: organizations.error,
  })
);

const Users = () => {
  const { orgId } = useParams();
  const { organizationUsers } = useAppSelector(selectOrganizationState);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { fetchData } = useFetchData(orgId);
  const { user } = useAppSelector((state: RootState) => state.user);

  const filteredData = user?.userOrg.filter(
    (item) => item.organization_id === Number(orgId)
  )[0];

  const groupedByActive = organizationUsers.reduce(
    (
      acc: {
        active: InvitesInfo[];
        inactive: InvitesInfo[];
      },
      user: InvitesInfo
    ) => {
      const isActive = user.Organizations?.[0]?.UserOrganization?.active;

      if (isActive) {
        acc.active.push(user);
      } else {
        acc.inactive.push(user);
      }

      return acc;
    },
    { active: [] as InvitesInfo[], inactive: [] as InvitesInfo[] }
  );

  const handleRemoveUser = async ({ user_id }: { user_id: string }) => {
    try {
      toast("Loading...", { isLoading: true });

      const { success, status } = await removeOrganizationUser({
        organizationId: orgId,
        user_id: user_id,
      });
      if (!success && status === 401) navigate("/login");

      await deleteUser({ user_id: user_id });

      toast.dismiss();
      toast.success("User romeved successfully!", {
        position: "top-right",
      });

      fetchData();
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Unable to Rmove user", {
        position: "top-right",
        delay: 1000,
      });
    }
  };

  const handleInviteFunc = async ({ email }: { email: string }) => {
    toast("Loading...", { isLoading: true });

    const { success, status } = await handleResend({ email: email });

    toast.dismiss();

    if (!success && status === 401) {
      navigate("/login");
    } else if (success) {
      toast.success("Link sent !", {
        position: "top-right",
        delay: 1000,
      });
      fetchData();
    } else {
      toast.dismiss();
      toast.error("Unable to send Link!", {
        position: "top-right",
        delay: 1000,
      });
    }
  };

  return (
    <div className="">
      <ToastContainer />
      <div className="flex p-5">
        <div className="w-[40%]">
          <h3 className="text-white font-semibold">Users</h3>
          <p className="text-gray-500 my-3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
            quisquam quo recusandae quasi aspernatur voluptatem dolorem maiores,
            sunt sit repellendus!
          </p>

          <button
            className={`bg-blue-600 px-5 py-2 rounded text-white font-semibold shadow-gray-600 shadow-sm transition-shadow duration-300 hover:shadow-none ${
              filteredData?.role !== "Manager" && user?.role !== "Admin"
                ? "hidden"
                : ""
            }`}
            onClick={() => setIsOpen(true)}
          >
            Invite Friends
          </button>
        </div>
        <div className="w-[60%] border-2 border-gray-700 rounded bg-gray-500 overflow-y-scroll h-80 no-scrollbar">
          {groupedByActive.active?.map((item) => {
            const role = item.Organizations?.[0]?.UserOrganization?.role;
            return (
              <div
                key={item.id}
                className="bg-custom-secondary p-3 flex items-center border-b border-custom-secondary hover:border-gray-500 transition duration-500"
              >
                <img
                  src="/src/assets/female.jpg"
                  alt="ee"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3 flex-1">
                  <h3 className="text-white font-semibold truncate overflow-hidden whitespace-nowrap w-[300px]">
                    {item.name}
                  </h3>
                  <p className="text-gray-300 truncate overflow-hidden whitespace-nowrap w-[300px] text-sm tracking-wide">
                    {item.email}
                  </p>
                </div>

                <div className="bg-gray-600 text-white rounded w-36 h-8 flex justify-center items-center cursor-pointer">
                  <p className="font-semibold">{role}</p>
                </div>

                <div
                  className="w-8 h-5 flex justify-center items-center ml-2"
                  onClick={() =>
                    handleRemoveUser({ user_id: item.id.toString() })
                  }
                >
                  <MdDelete
                    className={`text-gray-400 text-xl transform transition-transform duration-300 hover:scale-110 ${
                      filteredData?.role != "Manager" ? "hidden" : ""
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-b border-gray-700"></div>
      <div
        className={`flex p-5 ${
          filteredData?.role !== "Manager" && user?.role !== "Admin"
            ? "hidden"
            : ""
        }`}
      >
        <div className="w-[40%]">
          <h3 className="text-white font-semibold">Pending Invites</h3>
          <p className="text-gray-500 my-3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil
            quisquam quo recusandae quasi aspernatur voluptatem dolorem maiores,
            sunt sit repellendus!
          </p>
        </div>
        <div className="w-[60%] border-2 border-gray-700 rounded bg-gray-500 overflow-y-scroll no-scrollbar h-52">
          {groupedByActive.inactive.map((item) => (
            <div
              key={item.id}
              className="p-3 flex items-center bg-custom-primary border-b border-custom-secondary hover:border-gray-500 transition duration-500"
            >
              <img
                src="/src/assets/female.jpg"
                alt="ee"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3 flex-1">
                <h3 className="text-white font-semibold truncate overflow-hidden whitespace-nowrap w-[250px]">
                  {item.name}
                </h3>
                <p className="text-gray-300 text-sm truncate overflow-hidden whitespace-nowrap w-[250px] tracking-wide">
                  {item.email}
                </p>
              </div>

              <button
                className="bg-gray-600 px-3 py-2 rounded text-white font-semibold shadow-lg transition-shadow duration-300 hover:shadow-none"
                onClick={() => handleInviteFunc({ email: item.email })}
              >
                Resend
              </button>
              <button
                className="border border-red-500 px-3 py-2 rounded text-red-500 font-semibold shadow-lg transition-shadow duration-300 hover:shadow-none ml-3"
                onClick={async () => {
                  const res = await handleRevokeInvite({
                    user_id: item.id.toString(),
                    organizationId: orgId,
                  });
                  if (res) {
                    alert("Link was revoked successfully");
                  } else {
                    alert("Unable to revoke Link");
                  }
                }}
              >
                Revoke
              </button>

              <div
                className="w-8 h-5 flex justify-center items-center ml-2"
                onClick={() =>
                  handleRemoveUser({ user_id: item.id.toString() })
                }
              >
                <MdDelete
                  className={`text-gray-400 text-xl transform transition-transform duration-300 hover:scale-110 ${
                    filteredData?.role != "Manager" ? "hidden" : ""
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isOpen}>
        <div className="flex justify-between items-center p-5">
          <p className="text-lg tracking-wider font-semibold">Invite Member</p>
          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {orgId && (
          <InviteForm
            setIsOpen={setIsOpen}
            orgId={orgId}
            onDone={async () => fetchData()}
          />
        )}
      </Modal>
    </div>
  );
};

export default memo(Users);
