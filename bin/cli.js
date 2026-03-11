#!/usr/bin/env node

const { getIpInfo } = require("../src/index");

(async () => {
    try {
        console.log("\n🌐  Fetching IP info from whoer.to …\n");

        const start = performance.now();
        const info = await getIpInfo();
        const elapsed = (performance.now() - start).toFixed(0);
        const elapsedDisplay = elapsed >= 1000
            ? `${(elapsed / 1000).toFixed(2)}s`
            : `${elapsed}ms`;

        const rows = [
            ["IP Address", info.ip],
            ["Country", info.country],
            ["Country Code", info.countryCode],
            ["Region", info.region],
            ["City", info.city],
            ["ISP", info.isp],
            ["DNS Server", info.dns],
            ["Timezone", info.timezone],
            ["Local Time", info.localTime],
        ];

        // Calculate column widths for pretty printing
        const labelWidth = Math.max(...rows.map(([l]) => l.length)) + 2;

        console.log("─".repeat(labelWidth + 50));
        for (const [label, value] of rows) {
            console.log(`  ${label.padEnd(labelWidth)} │  ${value || "N/A"}`);
        }
        console.log("─".repeat(labelWidth + 50));

        console.log(`\n✅  Done. (fetched in ${elapsedDisplay})\n`);
    } catch (err) {
        console.error("❌  Failed to fetch IP info:", err.message);
        process.exit(1);
    }
})();
