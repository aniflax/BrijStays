type Env = {
  (key: string, defaultValue?: any): any;
  bool(key: string, defaultValue?: boolean): boolean;
  int(key: string, defaultValue?: number): number;
  array(key: string, defaultValue?: any[]): any[];
};

export default ({ env }: { env: Env }) => {
  const uploadConfig =
    env('R2_ACCESS_KEY_ID') &&
    env('R2_SECRET_ACCESS_KEY') &&
    env('R2_ENDPOINT') &&
    env('R2_BUCKET_NAME')
      ? {
          upload: {
            config: {
              provider: 'aws-s3',
              providerOptions: {
                baseUrl: env('R2_MEDIA_PUBLIC_URL'),
                s3Options: {
                  credentials: {
                    accessKeyId: env('R2_ACCESS_KEY_ID'),
                    secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
                  },
                  endpoint: env('R2_ENDPOINT'),
                  region: env('S3_REGION', 'auto'),
                  forcePathStyle: true,
                  params: {
                    ACL: 'public-read',
                    Bucket: env('R2_BUCKET_NAME'),
                  },
                },
              },
            },
          },
        }
      : {};

  return {
    'users-permissions': {
      config: {
        jwtSecret: env('JWT_SECRET'),
      },
    },
    ...uploadConfig,
  };
};
