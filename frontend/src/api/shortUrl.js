import { fetchWithAuth, getErrorMessage } from "./apiClient";

const validateUrl = (value) => {
  const url = value.trim();

  if (!url) {
    throw new Error("Please enter a URL.");
  }

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error("Please enter a valid HTTP or HTTPS URL.");
  }

  return url;
};

export const shortenUrl = async ({ url, slug }) => {
  const validatedUrl = validateUrl(url);
  const response = await fetchWithAuth("/api/create", {
    method: "POST",
    body: JSON.stringify({ url: validatedUrl, slug }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const shortUrl = (await response.text()).trim();

  if (!shortUrl) {
    throw new Error("The server returned an empty short URL.");
  }

  return shortUrl;
};

export const getMyUrls = async () => {
  const response = await fetchWithAuth("/api/create/my-urls");
  if (!response.ok) {
    throw new Error("Failed to fetch your URLs.");
  }
  const data = await response.json();
  return data.urls;
};
