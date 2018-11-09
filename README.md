
# Objectives
This project serves study purposes,
the whole functionalities are revolving around listening, downloading or uploading music.

# Stack
The application is a fully fledged TypeScript one for multiple reasons,  
one of it's primary goal is to modelize the entire codebase server side as well as client side so that is can import types/rules wherever i wish
to enforce type checking when needed and therefore keeping an ease of maintenance/development using VSCode intellisense and type inference.

Duck-typed database query results written as interfaces are a good example as they can be imported to the client waiting for those data using HTTP.

## Front-end
Client uses Webpack 4 as a bundler with TypeScript in conjunction transpiled using the Webpack configuration which makes Babel unnecessary and permit EcmaScript2018 latest features like ES2017's async/await pattern.

The client application uses React as it's framework with no particular additions (except react-router) like Redux or Mobex since it's state is handled via the vanilla React way for local ones and a more 'Global' state is handled via the Context API (which my implementation is in essence what Redux does minus all the verbosity coming with it) for data that need to accessed across the board.

Ant-design is used for everything UX/UI concerned or even data containers like tables etc...

Axios handles the AJAX part and is used as the HTTP client to launch XHRs and access the server.

## Back-end
Server uses TypeScript as well and run with the latest specifications of Node.js with Express as it's core web framework enabling clearer routing and patterns like the middleware one used to authenticate the user.

The database runs under PostgreSQL and is queried via a raw driver (handmade queries/ no ORM) called node-postgres or 'pg' along with a module, 'sql-template-string', to ease string interpolations in the said queries.

Jsonwebtoken and Bcrypt libraries are used for everything cryptography related

Multer is used to handle file uploading via multipart/form-data encoded request bodies

### Tools & additionnal librairies
Visual Studio Code: Highly configurable and extendable open-sourced text editor from Microsoft

nodemon: Library used for server reloading when configured sets of events are occurring

tslint: Linter for TypeScript

moment: Library to make JS dates manipulation handier

# Specs
Soon
