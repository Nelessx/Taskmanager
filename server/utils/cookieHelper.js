export const getCookieValue = (cookieString, cookieName) => {
  if (!cookieString) return null;

  const cookies = cookieString.split(";");
  const targetCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${cookieName}=`)
  );

  if (!targetCookie) return null;

  return targetCookie.split("=")[1];
};

export const createCookieOptions = (isProduction = false) => {
  return {
    maxAge: process.env.COOKIE_EXPIRE,
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
  };
};
