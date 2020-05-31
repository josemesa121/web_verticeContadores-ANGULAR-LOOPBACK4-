# vertice

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)


## Backend
`npm install`

`npm run clean` Limpiar version anterior

`npm run build` Para compilar la version de backend

`npm run migrate` Para actualizar/crear tablas de las base de datos
la configuracion de la base de datos esta en el archivo `src\datasources\db.datasource.json`

`npm run start-original` Para correr en modo desarrollo


## Frontend
`cd public`
`npm install`


## Deployment
`scp -r D:\work\angularwarriors\vertice-contadores\public\dist\ root@vertice:/var/www/vertice/public/dist`
