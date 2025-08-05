// src/pages/VerifyEmail.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      fetch("http://localhost:3000/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.message ? "success" : "error");
        })
        .catch(() => setStatus("error"));
    }
  }, [token]);

  return (
    <div>
      {status === "verifying" && <p>Verifying email...</p>}
      {status === "success" && (
        <p>
          <br></br>Email verified successfully! You can now login.
        </p>
      )}
      {status === "error" && <p>Verification failed. Token may be expired.</p>}
    </div>
  );
};

export default VerifyEmail;
