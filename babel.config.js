module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {node: 'current'},
        useBuiltIns: 'entry',
        corejs: 3
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-typescript',
    '@babel/plugin-transform-nullish-coalescing-operator'
  ]
};
