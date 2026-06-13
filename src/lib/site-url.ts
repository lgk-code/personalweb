const LOCAL_SITE_URL = "http://localhost:3000";

function getLocalSiteUrl() {
  const port = process.env.PORT?.trim();

  if (!port) {
    return new URL(LOCAL_SITE_URL);
  }

  const portNumber = Number(port);

  if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65_535) {
    return new URL(LOCAL_SITE_URL);
  }

  return new URL(`http://localhost:${portNumber}`);
}

function normalizeSiteUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol);
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return (
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL) ??
    getLocalSiteUrl()
  );
}
