export default {
  jwt: {
    secret: process.env.APP_SECRET || '5eb63bbbe01eeed093cb22bb8f5acdc3',
    expiresIn: '1d',
  },
};
