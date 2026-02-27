import { TextDecoder, TextEncoder } from "node:util";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" }); // Polyfill TextEncoder and TextDecoder for jose library
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
