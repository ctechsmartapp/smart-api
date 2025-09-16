export async function getUserDetails() {
  const token = localStorage.getItem("accessToken");
  const res = await fetch("http://localhost:5001/users/details", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json(); // e.g., { name: "John Doe", email: "john@example.com" }
}
