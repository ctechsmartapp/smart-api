const BASE_URL = "http://localhost:5001";

const getToken = () => localStorage.getItem("accessToken");

// Get ALL consultants
export const getAllConsultants = async () => {
  const res = await fetch(`${BASE_URL}/consultants`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch consultants");
  return res.json();
};

export const getConsultantById = async (id) => {
  const res = await fetch(`${BASE_URL}/consultants/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch consultant");
  return res.json();
};

// Add a new consultant
export const addConsultant = async (data) => {
  const res = await fetch(`${BASE_URL}/consultants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      errorCode: "ERROR",
      errorMessage: errorData.message || "Failed to create consultant",
    };
  }

  return res.json(); // expected { errorCode: "SUCCESS", ... }
};

// Update consultant
export const updateConsultant = async (data) => {
  const res = await fetch(`${BASE_URL}/consultants/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      errorCode: "ERROR",
      errorMessage: errorData.message || "Failed to update consultant",
    };
  }

  return res.json();
};

// Delete consultant
export const deleteConsultant = async (id) => {
  const res = await fetch(`${BASE_URL}/consultants/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      errorCode: "ERROR",
      errorMessage: errorData.message || "Failed to delete consultant",
    };
  }

  return res.json();
};
