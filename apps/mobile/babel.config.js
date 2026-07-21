module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Inlines EXPO-free env vars from .env into `@env` imports at build time.
    // These are public (Supabase anon key + API URL), never secrets.
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
