"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function Return() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/api/stripe/checkout_sessions?session_id=${sessionId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return redirect("/dashboard");
  }

  if (status === "complete") {
    return (
      <div className="w-1/2 mx-auto text-justify">
        <section id="success">
          <p>
            We appreciate your business! A confirmation email will be sent to{" "}
            {customerEmail}. If you have any questions, please email{" "}
            <a href="mailto:orders@example.com">orders@example.com</a>.
          </p>
        </section>
      </div>
    );
  }

  return null;
}
