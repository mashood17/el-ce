import client from "./client";

export const uploadImage = async (file, folder = "general") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const { data } = await client.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
};