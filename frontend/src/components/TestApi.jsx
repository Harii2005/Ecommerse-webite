import React, { useState } from "react";

const TestApi = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult("Testing...");

    try {
      // Test with fetch
      const response = await fetch(
        "https://ecommerse-webite-backendd.onrender.com/api/items?limit=2"
      );

      if (response.ok) {
        const data = await response.json();
        setResult(`SUCCESS: Got ${data.data.items.length} items`);
      } else {
        setResult(`FETCH ERROR: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setResult(`ERROR: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>API Test Component</h3>
      <button onClick={testAPI} disabled={loading}>
        {loading ? "Testing..." : "Test API"}
      </button>
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <strong>Result:</strong> {result}
      </div>
    </div>
  );
};

export default TestApi;
