import env from './config/env';
import dbInit from "./db/init";

dbInit();

export const start = async () => {
	const { setupApp } = await import('./config/app');
	const app = await setupApp();
	app.listen(env.port, () => console.log(`Server runnning at http://localhost:${env.port}`));
}

start();
