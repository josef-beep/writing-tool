import fs from 'node:fs';
import path from 'node:path';
import {MakerDMG} from '@electron-forge/maker-dmg';
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    extraResource:['resources/libreoffice','resources/fonts','resources/notices','resources/runtime-receipt.json'],
  },
  hooks:{prePackage:async(_config,platform,arch)=>{const receipt=JSON.parse(fs.readFileSync(path.resolve('resources/runtime-receipt.json'),'utf8')) as {schemaVersion:number;version:string;target:string;sha256:string;bytes:string},pins=JSON.parse(fs.readFileSync(path.resolve('scripts/resources/libreoffice-pins.json'),'utf8')) as {version:string;platforms:Record<string,{sha256:string;bytes:string}>},target=`${platform}-${arch}`,pin=pins.platforms[target];if(!pin||receipt.schemaVersion!==1||receipt.version!==pins.version||receipt.target!==target||receipt.sha256!==pin.sha256||receipt.bytes!==pin.bytes)throw new Error('Run npm run setup:resources on the requested native platform/architecture before packaging.');const executable=platform==='win32'?'program/soffice.exe':platform==='darwin'?'LibreOffice.app/Contents/MacOS/soffice':'program/soffice';for(const file of [`resources/libreoffice/${executable}`,'resources/fonts/LiberationSerif-Regular.ttf','resources/fonts/LiberationSans-Regular.ttf','resources/fonts/LiberationMono-Regular.ttf','resources/notices/LibreOffice-DISTRIBUTION.md','resources/notices/Liberation-Fonts-LICENSE.txt'])if(!fs.statSync(path.resolve(file)).isFile())throw new Error(`Missing pinned package resource: ${file}`);}},
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerDMG({}),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      devServer: { host: '127.0.0.1', hot: false, liveReload: false, client: false },
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/presentation/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/desktop/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
