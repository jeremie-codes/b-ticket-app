module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["react-native-reanimated/plugin"],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        "module-resolver",
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            components: "./src/components",
            contexts: "./src/contexts",
            services: "./src/services",
            utils: "./src/utils",
            navigation: "./src/navigation",
            screens: "./src/screens",
            themes: "./src/themes",
            constants: "./src/constants",
            assets: "./src/assets",
            types: "./src/types",
            buttons: "./src/components/ui/buttons",
            img: "./src/assets/img",
            texts: "./src/components/ui/texts",
            hooks: "./src/hooks",
            src: "./src",
          },
        },
      ],
    ],
  };
};
