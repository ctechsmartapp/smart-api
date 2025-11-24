const BASE_URL = "http://localhost:5001";

const getToken = () => localStorage.getItem("accessToken");

// Get ALL submissions
export const getAllSubmissions = async () => {
  const res = await fetch(`${BASE_URL}/submissions`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch submissions");
  return res.json();
};

// Get submission by ID
export const getSubmissionById = async (id) => {
  const res = await fetch(`${BASE_URL}/submissions/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch submission");
  return res.json();
};

// Add a new submission
export const addSubmission = async (data) => {
  const res = await fetch(`${BASE_URL}/submissions`, {
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
      errorMessage: errorData.message || "Failed to create submission",
    };
  }

  return res.json(); // expected { errorCode: "SUCCESS", ... }
};

// Update submission
export const updateSubmission = async (data) => {
  const res = await fetch(`${BASE_URL}/submissions/${data.id}`, {
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
      errorMessage: errorData.message || "Failed to update submission",
    };
  }

  return res.json();
};

// Delete submission
export const deleteSubmission = async (id) => {
  const res = await fetch(`${BASE_URL}/submissions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      errorCode: "ERROR",
      errorMessage: errorData.message || "Failed to delete submission",
    };
  }

  return res.json();
};
