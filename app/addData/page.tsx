"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { Endpoints, QueryKey, Status } from "../apis/Endpoints";
import ApiRequest from "../apis/Request";

interface UserData {
  id?: string;
  name: string;
  alterEgo: string;
}

const createPost = async (newPost: { name: string; alterEgo: string }) => {
  const response = await ApiRequest.post(Endpoints.Superheroes, newPost);
  if (response.status !== Status.Created)
    throw new Error("Failed to create post");
};

const fetchSingleUser = async (id: string) => {
  const response = await ApiRequest.get(Endpoints.Superheroes + `/${id}`);
  if (response.status !== Status.Ok)
    throw new Error("Failed to fetch single user");
  return response.data;
};

const updatePost = async (newPost: {
  id: string;
  name: string;
  alterEgo: string;
}) => {
  const response = await ApiRequest.put(
    `${Endpoints.Superheroes}/${newPost.id}`,
    newPost
  );
  if (response.status !== Status.Created)
    throw new Error("Failed to update post");
};

const useSingleUser = (userId: string) => {
  return useQuery({
    queryKey: [QueryKey.Superheroes, userId],
    queryFn: () => fetchSingleUser(userId),
    enabled: !!userId,
  });
};

const AddData = ({
  editId,
  onCancel,
}: {
  editId: string;
  onCancel: () => void;
}) => {
  const { data, isLoading, error } = useSingleUser(editId);
  const [userData, setUserData] = useState<UserData>({
    id: editId,
    name: "",
    alterEgo: "",
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Superheroes] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Superheroes] });
    },
  });

  useEffect(() => {
    if (data) {
      setUserData({ ...data });
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData.name !== "" && userData.alterEgo !== "") {
      createMutation.mutate({
        name: userData.name,
        alterEgo: userData.alterEgo,
      });
      setUserData({ name: "", alterEgo: "" });
    }
  };

  const handleUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData.name !== "" && userData.alterEgo !== "") {
      updateMutation.mutate({
        id: editId,
        name: userData.name,
        alterEgo: userData.alterEgo,
      });
      setUserData({ name: "", alterEgo: "" });
    }
  };

  const handleCancel = () => {
    onCancel();
    setUserData({ name: "", alterEgo: "" });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <form
        onSubmit={editId ? handleUpdateUser : handleAddUser}
        className="space-y-4"
      >
        <div>
          <input
            type="text"
            value={userData.name}
            onChange={handleChange}
            className="border-2 p-2 rounded"
            name="name"
            placeholder="Hero Name"
          />
        </div>
        <div>
          <input
            type="text"
            value={userData.alterEgo}
            onChange={handleChange}
            className="border-2 p-2 rounded"
            name="alterEgo"
            placeholder="Alter Ego"
          />
        </div>
        <div className="space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddData;
