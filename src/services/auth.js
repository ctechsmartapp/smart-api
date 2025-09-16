// src/services/auth.js
export async function login(email, password) {
  const res = await fetch("http://localhost:5001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log(res);
  if (!res.ok) throw new Error("Login failed");
  
  return res.json(); 
}

export async function signup(email, password, firstname, lastname) {
  const res = await fetch("http://localhost:5001/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstname, lastname }),
  });
  console.log(res);
  if (!res.ok) throw new Error("Signup failed");
  console.log(res);
  return res.json(); 
}

export async function refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("refreshToken :", refreshToken);
    console.log(JSON.stringify({refreshToken}));
    const res = await fetch("http://localhost:5001/auth/refreshToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({refreshToken}),
    });
    if (!res.ok) throw new Error("Refresh Token failed");
    return res.json(); 
}
