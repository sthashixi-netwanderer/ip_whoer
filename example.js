const { getIpInfo } = require("./src/index");

(async () => {
    try {
        const info = await getIpInfo();
        console.log("IP Info:", JSON.stringify(info, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    }
})();
