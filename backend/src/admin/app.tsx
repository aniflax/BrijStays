import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
    auth: {
      logo: '/Favicon%20brijstays.png',
    },
    menu: {
      logo: '/Favicon%20brijstays.png',
    },
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to Brij Stays!',
        'Auth.form.welcome.subtitle': 'Log in to your Administrative Panel',
      },
    },
  },
  bootstrap(app: StrapiApp) {},
};
