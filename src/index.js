const axios = require("axios");
const cheerio = require("cheerio");

const WHOER_URL = "https://whoer.to/";

/**
 * Fetches public IP information from whoer.to
 *
 * @returns {Promise<Object>} IP information object
 * @property {string} ip          - Public IPv4 address
 * @property {string} country     - Country name
 * @property {string} countryCode - ISO 3166-1 alpha-2 country code
 * @property {string} region      - Region / state / province
 * @property {string} city        - City name
 * @property {string} isp         - Internet Service Provider
 * @property {string} dns         - DNS server address (may be "N/A" — requires JS)
 * @property {string} timezone    - IANA timezone identifier
 * @property {string} localTime   - Local time string
 */
async function getIpInfo() {
    const { data: html } = await axios.get(WHOER_URL, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 15000,
    });

    const $ = cheerio.load(html);

    // --- IPv4 (direct ID) ---
    const ip = ($("#remote_addr4").text() || "").trim();

    // --- Local time (direct ID) ---
    const localTime = ($("#local_time").text() || "").trim();

    // --- Helper: exact-match a row label and return the value cell text ---
    function getRowValue(labelMatch) {
        let value = "";
        $("table.innertable tr").each(function () {
            const cells = $(this).find("td");
            if (cells.length < 2) return; // skip rows without value cells

            // Get the label text (strip <strong>, <abbr>, etc.)
            const labelText = $(cells[0]).text().trim();

            if (labelText.toLowerCase() === labelMatch.toLowerCase()) {
                // Get the second cell (value), which may span columns
                const valueCell = $(cells[1]);
                // Remove scripts and noscripts so we get clean text
                valueCell.find("script, noscript").remove();
                value = valueCell.text().trim();
                return false; // break
            }
        });
        return value;
    }

    // --- Country + country code (combined in one cell) ---
    // HTML: <img class="flag flag-gh" ...><span class="ipadotted"> Ghana </span>(GH)
    let country = "";
    let countryCode = "";

    $("table.innertable tr").each(function () {
        const cells = $(this).find("td");
        if (cells.length < 2) return;
        const labelText = $(cells[0]).text().trim();
        if (labelText.toLowerCase() === "country") {
            const valueCell = $(cells[1]);
            // Country name is inside <span class="ipadotted">
            country = valueCell.find("span.ipadotted").text().trim();
            // Country code is in parentheses after the span, e.g. (GH)
            const fullText = valueCell.text().trim();
            const codeMatch = fullText.match(/\(([A-Z]{2})\)/);
            if (codeMatch) countryCode = codeMatch[1];
            // Fallback: extract from flag class  e.g. "flag-gh"
            if (!countryCode) {
                const flagClass = valueCell.find("img[class*='flag-']").attr("class") || "";
                const flagMatch = flagClass.match(/flag-([a-z]{2})/);
                if (flagMatch) countryCode = flagMatch[1].toUpperCase();
            }
            return false;
        }
    });

    // --- Region, City ---
    const region = getRowValue("Region");
    const city = getRowValue("City");

    // --- ISP (label is inside <abbr> so text() returns "ISP") ---
    const isp = getRowValue("ISP");

    // --- Timezone (label is "zone") ---
    const timezone = getRowValue("zone");

    // --- DNS Server ---
    // DNS is loaded via JS (detectdns()), so static HTML won't have the value.
    // We still attempt to read whatever is in the #dns span, stripped of scripts.
    let dns = "";
    const dnsEl = $("#dns").clone();
    dnsEl.find("script, noscript").remove();
    dns = dnsEl.text().trim() || "N/A";

    return {
        ip,
        country,
        countryCode,
        region,
        city,
        isp,
        dns,
        timezone,
        localTime,
    };
}

module.exports = { getIpInfo };
