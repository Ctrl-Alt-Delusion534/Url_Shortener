export const authCookieName = "accessToken";
export const refreshCookieName = "refreshToken";

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000*60*10, 
    path: "/"
};

export const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000*60*60*24*7, 
    path: "/"
};
