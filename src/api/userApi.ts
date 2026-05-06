// src/api/userApi.ts

const API_URL = "http://localhost:5000/api/users";

// GET users
export const getUsers = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

// CREATE user
export const createUser = async (user: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return res.json();
};

// UPDATE user
export const updateUser = async (id: string, user: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return res.json();
};

// DELETE user
export const deleteUser = async (id: string) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};