// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import all from './all';

export const environment = {
  ...all,
  production: false,
  //  apiUrl: 'http://localhost:1380'
  //apiUrl: 'http://localhost:8081'
   apiUrl: 'http://api.mbhxh.com.vn'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frsames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
