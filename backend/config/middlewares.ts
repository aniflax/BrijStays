type Env = {
  (key: string, defaultValue?: any): any;
  bool(key: string, defaultValue?: boolean): boolean;
  int(key: string, defaultValue?: number): number;
  array(key: string, defaultValue?: any[]): any[];
};

export default ({ env }: { env: Env }) => {
  const localOrigins = ['http://localhost:3000', 'http://localhost:8080'];
  // Production origins are included by default so the deployed API stays
  // browser-reachable even before CORS_ORIGINS is set in the Render dashboard.
  const defaultOrigins = ['https://brijstays.in', 'https://www.brijstays.in'];
  const envOrigins = env('CORS_ORIGINS', '')
    .split(',')
    .map((origin: string) => origin.trim())
    .filter(Boolean);
  const origins = Array.from(new Set([...localOrigins, ...defaultOrigins, ...envOrigins]));

  // Media CDN origin (Cloudflare R2) served through https://cdn.brijstays.in.
  // Strapi's default CSP only allows 'self', data:, blob: and market-assets,
  // so the CDN must be added explicitly or admin/media previews are blocked.
  const cdnUrl = (env('R2_MEDIA_PUBLIC_URL', '') || 'https://cdn.brijstays.in').replace(
    /\/+$/,
    '',
  );

  return [
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', cdnUrl],
            'media-src': ["'self'", 'data:', 'blob:', cdnUrl],
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: origins,
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      },
    },
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
