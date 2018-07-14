## Google maps fun
### Collaborative maps editing with Google maps and Socket.io

### Current features:
- Placing pins on map,
- Saving all pins as valid GeoJSON,
- Adding custom properties to each pin,
- Removing specific pin

### Directory structure:
- `webpack` - webpack config files,
- `src/frontend` - frontend source files,
- `src/backend` - backend source files

### Setup:
> `npm run backend` - Compile backend to `bin` folder, and start server with nodemon
> `npm run frontend` - Compile frontend to `dist` folder

### `dotenv` file structure:
```PG_URL=postgresql://dbuser:secretpassword@database.server.com:3211/mydb```
```APP_PORT=XXXX```