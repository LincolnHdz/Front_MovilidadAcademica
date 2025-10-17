import { useEffect } from "react";
import api from "../api/axiosConfig";

const useVisitorTracking = (pageName, action = "visit") => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        await api.post(
          "/visitor-logs/log",
          {
            page_visited: pageName,
            action: action,
          },
          config
        );
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.debug("Visitor tracking failed:", error);
      }
    };

    // Track the visit
    trackVisit();
  }, [pageName, action]);
};

export default useVisitorTracking;
