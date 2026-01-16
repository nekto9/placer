export const botDeepLink = (deepLink: string) => {
  const resultLink = `https://t.me/${process.env.BOT_NAME}?start=${deepLink}`;
  window.location.href = resultLink;
};
