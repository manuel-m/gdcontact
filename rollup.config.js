import path from 'path';

import alias from 'rollup-plugin-alias';
import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
  input: 'src/index.js',
  output: {
    file: 'public/js/app.js',
    format: 'iife',
  },
  plugins: [
    alias({
      inferno: path.join(
        __dirname,
        './src/inferno-v7.1.7/inferno/src/index.js',
      ),
      'inferno-component': path.join(
        __dirname,
        './src/inferno-v7.1.7/inferno-component/src/index.js',
      ),
      'inferno-shared': path.join(
        __dirname,
        './src/inferno-v7.1.7/inferno-shared/src/index.js',
      ),
      'inferno-component': path.join(
        __dirname,
        './src/inferno-v7.1.7/inferno-component/src/index.js',
      ),
      'inferno-create-element': path.join(
        __dirname,
        './src/inferno-v7.1.7/inferno-create-element/src/index.js',
      ),
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.INFERNO_VERSION': JSON.stringify('7.1.7'),
    }),
    buble({ jsx: 'createElement' }),
    process.env.NODE_ENV === 'production' &&
      uglify(
        {
          compress: {
            sequences: false,
            properties: false,
            dead_code: true,
            drop_debugger: true,
            unsafe: false,
            conditionals: false,
            comparisons: false,
            evaluate: false, // [!] disable asm.js if true
            booleans: false,
            loops: false,
            unused: true,
            hoist_funs: true,
            hoist_vars: true,
            if_return: true,
            join_vars: false,
            side_effects: false,
            warnings: true,
          },
          mangle: false,
          output: {
            beautify: true,
          },
        },
        minify,
      ),
  ],
};
