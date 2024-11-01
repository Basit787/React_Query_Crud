"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "./Loading";
import AddData from "./addData/page";
import { Endpoints, QueryKey, Status } from "./apis/Endpoints";
import ApiRequest from "./apis/Request";
import { useState } from "react";

const fetchPosts = async () => {
  const response = await ApiRequest.get(Endpoints.Superheroes);
  if (response.status !== Status.Ok)
    throw new Error("Network response was not ok");
  return response.data;
};

const deletePost = async (postId: string) => {
  const response = await ApiRequest.delete(
    `${Endpoints.Superheroes}/${postId}`
  );
  if (response.status !== Status.Ok) throw new Error("Failed to delete post");
};

const usePostQuery = () => {
  return useQuery({
    queryKey: [QueryKey.Superheroes],
    queryFn: fetchPosts,
  });
};

const Posts = () => {
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState<string>("");

  const { data, isLoading, error } = usePostQuery();

  const deleteHero = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Superheroes] });
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Error is: {error.message}</p>;

  const handleDelete = (id: string) => deleteHero.mutate(id);

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const handleCancel = () => {
    setEditId("");
  };

  return (
    <section>
      <AddData editId={editId} onCancel={handleCancel} />
      <div>
        {data?.map(
          (
            post: { id: string; name: string; alterEgo: string },
            index: number
          ) => (
            <div key={index} className="flex gap-2 items-center m-2">
              <div>
                <span>{`${index + 1}) `}</span>
                <span>{post.name}</span> <span>{post.alterEgo}</span>
              </div>
              <button
                className="bg-green-500 text-white p-1 rounded"
                onClick={() => handleEdit(post.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Posts;
