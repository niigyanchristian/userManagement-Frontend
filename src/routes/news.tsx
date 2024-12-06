import { useEffect, useState } from "react";
import { GrEdit } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { deletePosts, fetchPosts, updatePosts } from "../store/postsSlice";
import { RootState } from "../store/store";
import { Post } from "../types/interfaces";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../components/Modal";
import PostForm from "../components/PostForm";

const News: React.FC = () => {
  const { orgId } = useParams();
  const dispatch = useAppDispatch();
  const {
    posts: postsData,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.posts);
  const [posts, setPosts] = useState<Post[]>(postsData);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { user } = useAppSelector((state: RootState) => state.user);

  const filteredData = user?.userOrg.filter(
    (item) => item.organization_id === Number(orgId)
  )[0];

  const handleEditClick = (id: number | null) => {
    setEditingId(id);
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, [field]: value } : post
      )
    );
  };

  const handleSave = async () => {
    const updatedPost = posts.find((post) => post.id === editingId);

    if (updatedPost) {
      try {
        const { id, title, description } = updatedPost;
        toast("Loading...");
        await dispatch(updatePosts({ id, title, description })).unwrap();
        toast.dismiss();
        toast.success("Updated!");
      } catch (error) {
        throw new Error(error as string);
      }
    }

    setEditingId(null);
  };

  useEffect(() => {
    if (orgId) {
      dispatch(fetchPosts({ orgId: orgId }));
    }
  }, [orgId, dispatch]);

  useEffect(() => {
    setPosts(postsData);
  }, [postsData]);

  const handleDeleteClick = async ({ id }: { id: number }) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    toast.loading("Deleting post...");
    try {
      await dispatch(deletePosts({ id })).unwrap();
      if (orgId) {
        await dispatch(fetchPosts({ orgId: orgId }));
      }
      toast.dismiss();
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete post. Please try again.");
      console.error("Delete Error:", error);
    }
  };

  if (error) return <p>{error.toString()}</p>;

  return (
    <div className="">
      <ToastContainer />
      <div className="flex items-center gap-5 py-2">
        <p className="text-3xl text-white">Posts</p>
        <div
          className={`w-8 h-8 flex justify-center items-center rounded-full transition duration-300 hover:bg-custom-secondary cursor-pointer ${
            filteredData?.role !== "Manager" && user?.role !== "Admin"
              ? "hidden"
              : ""
          }`}
          onClick={() => setIsOpen(true)}
        >
          <FaPlus className="text-gray-300 text-xls" />
        </div>
      </div>
      {!loading &&
        posts.map((item) => (
          <div
            key={item.id}
            className="w-[100%] flex flex-col p-5 rounded relative mt-5 bg-custom-secondary"
          >
            <div className="flex flex-col items-start gap-5">
              {editingId === item.id ? (
                <>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleInputChange(item.id, "title", e.target.value)
                    }
                    className="bg-transparent mb-5 font-bold text-gray-300 text-2xl tracking-wider"
                  />
                  <textarea
                    rows={5}
                    value={item.description}
                    onChange={(e) =>
                      handleInputChange(item.id, "description", e.target.value)
                    }
                    className="bg-transparent text-gray-400 w-full"
                  ></textarea>

                  <div className="flex gap-5">
                    <button
                      onClick={() => handleEditClick(null)}
                      className="bg-gray-600 px-5 py-2 rounded text-white font-semibold shadow-gray-600 shadow-sm transition-shadow duration-300 hover:shadow-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 px-5 py-2 rounded text-white font-semibold shadow-gray-600 shadow-sm transition-shadow duration-300 hover:shadow-none"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-bold text-gray-300 text-2xl tracking-wider">
                    {item.title}
                  </p>
                  <p className="text-gray-400">{item.description}</p>
                </>
              )}
            </div>

            <div
              className={`w-8 h-8 flex justify-center items-center absolute top-3 right-14 z-10 rounded-full transition duration-300 hover:bg-custom-primary cursor-pointer ${
                filteredData?.role !== "Manager" && user?.role !== "Admin"
                  ? "hidden"
                  : ""
              }`}
              onClick={() => handleEditClick(item.id)}
            >
              <GrEdit className="text-white" />
            </div>
            <div
              className={`w-8 h-8 flex justify-center items-center absolute top-3 right-4 z-10 rounded-full transition duration-300 hover:bg-custom-primary cursor-pointer ${
                filteredData?.role !== "Manager" && user?.role !== "Admin"
                  ? "hidden"
                  : ""
              }`}
              onClick={() => handleDeleteClick({ id: item.id })}
            >
              <MdDeleteOutline className="text-red-500" />
            </div>
          </div>
        ))}

      <Modal isOpen={isOpen}>
        <div className="flex justify-between items-center p-5">
          <p className="text-lg tracking-wider font-semibold">Create Post</p>
          <button onClick={() => {}}>✕</button>
        </div>

        {orgId && (
          <PostForm onDone={() => {}} orgId={orgId} setIsOpen={setIsOpen} />
        )}
      </Modal>
    </div>
  );
};

export default News;
