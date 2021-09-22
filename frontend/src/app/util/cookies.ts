/**
 * Gets a cookie.
 * @param name Name of the cookie
 * @returns The cookie's string value, or null
 */
export function getCookie(name: string): string | null {
  let cname = name + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return null;
}

/**
 * Deletes a cookie.
 * @param name Name of the cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

/**
 * Creates or sets a cookie.
 * @param name Name of the cookie
 * @param value The new value
 */
export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/`;
}
