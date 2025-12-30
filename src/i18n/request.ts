import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const store = await cookies(); // ❗ nincs await
  const locale = store.get("locale")?.value ?? "en";

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
