import type { Core } from '@strapi/strapi';

const ensureProtocol = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('/')) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
};

const fixFile = (file: any): boolean => {
  let changed = false;
  if (file.url && file.url !== ensureProtocol(file.url)) {
    file.url = ensureProtocol(file.url);
    changed = true;
  }
  if (file.formats && typeof file.formats === 'object') {
    for (const key of Object.keys(file.formats)) {
      const format = file.formats[key];
      if (format?.url && format.url !== ensureProtocol(format.url)) {
        format.url = ensureProtocol(format.url);
        changed = true;
      }
    }
  }
  return changed;
};

/**
 * Content types the marketing site reads without authentication. Each gets
 * `find`/`findOne` granted idempotently to the public role on boot.
 */
const PUBLIC_CONTENT_TYPES = [
  'api::blog.blog',
  'api::stay.stay',
  'api::gallery-image.gallery-image',
  'api::standard-image.standard-image',
  'api::review.review',
  'api::instagram-video.instagram-video',
];

/** Idempotently grants the public role read access to public content-type APIs. */
async function ensurePublicContentPermissions(strapi: Core.Strapi) {
  try {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!publicRole) return;

    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: { type: 'public' } } });
    const existingActions = new Set(existing.map((p: any) => p.action));
    const wanted = PUBLIC_CONTENT_TYPES.flatMap((uid) => [
      `${uid}.find`,
      `${uid}.findOne`,
    ]);

    for (const action of wanted) {
      if (!existingActions.has(action)) {
        await strapi.db
          .query('plugin::users-permissions.permission')
          .create({ data: { action, role: publicRole.id } });
        strapi.log.info(`[permissions] Granted public access to ${action}`);
      }
    }
  } catch (err) {
    strapi.log.warn(`[permissions] Could not grant public content access: ${err}`);
  }
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.server.routes([
      {
        method: 'GET',
        path: '/health',
        handler: (ctx: any) => {
          ctx.body = 'Ok';
        },
        config: {
          auth: false,
        },
      },
    ]);
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const uploadModel = 'plugin::upload.file';
      const files = await strapi.db.query(uploadModel).findMany();

      let updated = 0;
      for (const file of files) {
        if (fixFile(file)) {
          await strapi.db.query(uploadModel).update({ where: { id: file.id }, data: file });
          updated++;
        }
      }

      if (updated > 0) {
        strapi.log.info(`[r2-url-fix] Fixed ${updated} upload record(s) with missing protocol`);
      }
    } catch (err) {
      strapi.log.warn(`[r2-url-fix] Could not fix upload URLs: ${err}`);
    }

    await ensurePublicContentPermissions(strapi);
  },
};
