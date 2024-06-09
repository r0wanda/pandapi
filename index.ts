import Api from './src/Api.js';
import { config as dotenv } from 'dotenv';

dotenv();

if (!process.env.USERNAME || !process.env.PASS) throw new Error('no user or pass');

const a = await Api.init(process.env.USERNAME, process.env.PASS);
console.log((await a.sortedPlaylists()).items[0]);
