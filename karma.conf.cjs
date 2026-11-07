
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function buscarEnPath(comando) {
  try {
    const buscador = process.platform === 'win32' ? 'where.exe' : 'which';
    const resultado = execFileSync(buscador, [comando], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return resultado
      .split(/\r?\n/)
      .map(ruta => ruta.trim())
      .find(ruta => ruta && fs.existsSync(ruta));
  } catch {
    return undefined;
  }
}

function detectarNavegador() {
  // Respetar una configuración existente.
  if (process.env.CHROME_BIN) {
    return process.env.CHROME_BIN;
  }

  const rutas = [];

  if (process.platform === 'win32') {
    const programFiles = process.env.PROGRAMFILES || 'C:\\Program Files';
    const programFilesX86 =
      process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env.LOCALAPPDATA || '';

    for (const base of [programFiles, programFilesX86, localAppData]) {
      if (!base) continue;

      rutas.push(
        path.join(base, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
        path.join(base, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      );
    }
  } else if (process.platform === 'darwin') {
    rutas.push(
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      path.join(
        process.env.HOME || '',
        'Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      ),
    );
  } else {
    rutas.push(
      '/usr/bin/microsoft-edge',
      '/usr/bin/microsoft-edge-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
    );
  }

  const comandos = [
    'msedge',
    'microsoft-edge',
    'microsoft-edge-stable',
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    'chrome',
  ];

  for (const comando of comandos) {
    const encontrada = buscarEnPath(comando);
    if (encontrada) rutas.push(encontrada);
  }

  return rutas.find(ruta => fs.existsSync(ruta));
}

const navegador = detectarNavegador();

if (navegador) {
  process.env.CHROME_BIN = navegador;
  console.log('Navegador para Karma:', navegador);
} else {
  console.warn(
    'No se encontró Edge ni Chrome. Instala un navegador compatible o configura CHROME_BIN.',
  );
}

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx',
    ],

    preprocessors: {
      'src/**/*.spec.ts': ['esbuild'],
      'src/**/*.spec.tsx': ['esbuild'],
    },

    esbuild: {
      target: 'es2020',
      format: 'iife',
      jsx: 'automatic',
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-esbuild'),
      require('karma-chrome-launcher'),
    ],

    browsers: ['NavegadorHeadless'],

    customLaunchers: {
      NavegadorHeadless: {
        base: 'ChromeHeadless',
        flags: [
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
        ],
      },
    },

    singleRun: true,
    reporters: ['progress'],
  });
};

