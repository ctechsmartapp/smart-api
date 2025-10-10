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

export async function signup(email, password, firstname, lastname, role) {
  const res = await fetch("http://localhost:5001/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstname, lastname, role }),
  });

  const data = await res.json();
  console.log(data.error);
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("refreshToken :", refreshToken);
  console.log(JSON.stringify({ refreshToken }));
  const res = await fetch("http://localhost:5001/auth/refreshToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error("Refresh Token failed");
  return res.json();
}

// Verify OTP API
export async function verifyOtp(email, otp) {
  const res = await fetch("http://localhost:5001/auth/verifyOTP", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) throw new Error("OTP verification failed");
  return res.json();
}

//Request OTP
export async function forgotPassword(email) {
  const res = await fetch("http://localhost:5001/auth/forgotPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  return { status: res.status, data }; // should contain { message: "OTP sent" }
}

// Reset password API
export async function resetPassword(email, password) {
  const res = await fetch("http://localhost:5001/auth/resetPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Failed to reset password");
  }

  return data;
}
