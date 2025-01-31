import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const searchVideos = async (query, maxResults = 20) => {
  try {
    if (!API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    console.log("Searching with query:", query); // Debug log

    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: "snippet",
        maxResults: maxResults,
        key: API_KEY,
        q: query,
        type: "video",
        videoCategoryId: "10", // Limit to music category
      },
    });

    if (!response.data || !response.data.items) {
      throw new Error("Invalid response format from YouTube API");
    }

    return response.data.items;
  } catch (error) {
    // More detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("YouTube API Error Response:", {
        status: error.response.status,
        data: error.response.data,
      });

      if (error.response.status === 403) {
        throw new Error(
          "YouTube API access forbidden. Please check your API key."
        );
      }
      if (error.response.status === 429) {
        throw new Error("YouTube API quota exceeded. Please try again later.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("No response received from YouTube API");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};
