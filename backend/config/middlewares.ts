type Env = {
  (key: string, defaultValue?: any): any;
  bool(key: string, defaultValue?: boolean): boolean;
  int(key: string, defaultValue?: number): number;
  array(key: string, defaultValue?: any[]): any[];
};

export default ({ env }: { env: Env }) => {
  const localOrigins = ['http://localhost:3000', 'http://localhost:8080'];
  const envOrigins = env('CORS_ORIGINS', '')
    .split(',')
    .map((origin: string) => origin.trim())
    .filter(Boolean);
  const origins = Array.from(new Set([...localOrigins, ...envOrigins]));

  return [
    'strapi::errors',
    'strapi::security',
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
