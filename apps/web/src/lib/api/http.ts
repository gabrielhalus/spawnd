export const fetchAuthenticated = async (input: RequestInfo, init?: RequestInit) => {
  const accessToken = localStorage.getItem("accessToken");

  const headers = new Headers(init?.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(input, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      const newAccessToken = data.accessToken;
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        res = await fetch(input, {
          ...init,
          headers,
        });
      }
    }
  }

  return res;
};
