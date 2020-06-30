import { useState, useEffect } from "react";
export default (key, initialValue = "") => {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key) || initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};
