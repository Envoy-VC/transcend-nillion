// import type * as express from 'express';

// import React from 'react';
// import { renderToString } from 'react-dom/server';
// import { routes } from './routes';

// import {
//   createStaticHandler,
//   createStaticRouter,
//   StaticRouterProvider,
// } from 'react-router-dom/server';

// export function createFetchRequest({
//   req,
//   res,
// }: {
//   req: express.Request;
//   res: express.Response;
// }): Request {
//   const origin = `${req.protocol}://${req.get('host')}`;
//   const url = new URL(req.originalUrl || req.url, origin);

//   const controller = new AbortController();
//   res.on('close', () => controller.abort());

//   const headers = new Headers();

//   for (const [key, values] of Object.entries(req.headers)) {
//     if (values) {
//       if (Array.isArray(values)) {
//         for (const value of values) {
//           headers.append(key, value);
//         }
//       } else {
//         headers.set(key, values);
//       }
//     }
//   }

//   const init: RequestInit = {
//     method: req.method,
//     headers,
//     signal: controller.signal,
//   };

//   if (req.method !== 'GET' && req.method !== 'HEAD') {
//     init.body = req.body;
//   }

//   return new Request(url.href, init);
// }

// export const render = async (
//   request: express.Request,
//   response: express.Response
// ) => {
//   const { query, dataRoutes } = createStaticHandler(routes);
//   const remixRequest = createFetchRequest({ req: request, res: response });
//   const context = await query(remixRequest);

//   if (context instanceof Response) {
//     throw context;
//   }
//   const router = createStaticRouter(dataRoutes, context);
//   const html = renderToString(
//     <React.StrictMode>
//       <StaticRouterProvider
//         context={context}
//         nonce='the-nonce'
//         router={router}
//       />
//     </React.StrictMode>
//   );
//   return { html };
// };
