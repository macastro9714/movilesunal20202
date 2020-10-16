module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          corejs: 5,
        },
      ],
    ],
  };
};
