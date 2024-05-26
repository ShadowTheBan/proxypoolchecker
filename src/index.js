import got from "got";
import { HttpsProxyAgent } from "hpagent";

import config from "../config.js";
import consola from "consola";

const proxies = {
    saved: [],
    duplicate: 0,
    checked: 0,
    errors: 0,
    working: 0
}

const makeId = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

const ipRegex = /((\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)|(\b(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}\b))/;

async function checkProxy() {
    try {
        const agent = new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            scheduling: "lifo",
            proxy: config.proxy.replace("%SESSION%", makeId(8)),
            timeout: config.timeout
        });

        const gotClient = got.extend({
            agent: {
                https: agent,
            },
            timeout: {
                request: config.timeout,
            }
        });
        const { body } = await gotClient("https://api64.ipify.org/?format=text");

        // if body is not ip address, then proxy is not working
        if (!ipRegex.test(body)) {
            throw new Error("Invalid IP address");
        }

        if (proxies.saved.includes(body)) {
            proxies.duplicate++;
            throw new Error("Duplicate IP address: " + body);
        }

        consola.success(`[${proxies.working}] Proxy working: ${body}`);

        proxies.working++;
        proxies.saved.push(body);
    } catch (error) {
        proxies.errors++;
        consola.info(`[${proxies.errors}] Proxy error: ${error.message}`);
    }

    proxies.checked++;

    process.title = `Checked: ${proxies.checked} | Working: ${proxies.working} | Errors: ${proxies.errors} | Duplicate: ${proxies.duplicate}`;
}

async function main() {
    const promises = Array.from({ length: config.threads }, async (_, i) => {
        try {
            for (let j = 0; j < config.maxChecks; j++) {
                await checkProxy(config.proxy);
            }
        } catch (error) {
            consola.error('Error in main loop:', error.message);
        }
    });

    await Promise.all(promises);

    consola.success(`Detected ${proxies.working} unique proxies on a total of ${proxies.checked} checked proxies`);
}

main().catch((error) => {
    consola.error(error);
});