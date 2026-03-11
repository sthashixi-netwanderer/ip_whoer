# ip_whoer

A lightweight Node.js package that fetches your public IP information from [whoer.to](https://whoer.to/).

## Fields Returned

| Field        | Description                           |
| ------------ | ------------------------------------- |
| `ip`         | Public IPv4 address                   |
| `ipv6`       | Public IPv6 address (or `"N/A"`)      |
| `country`    | Country name                          |
| `countryCode`| ISO 3166-1 alpha-2 country code       |
| `region`     | Region / state / province             |
| `city`       | City name                             |
| `isp`        | Internet Service Provider             |
| `dns`        | DNS server address                    |
| `timezone`   | IANA timezone identifier              |
| `localTime`  | Local time string                     |

## Installation

Since the package is hosted on GitHub, you can install it directly using your GitHub username and repository name:

```bash
npm install yourusername/ip_whoer
```

Or, using the full GitHub URL:

```bash
npm install github:yourusername/ip_whoer
```

To install it globally (which allows you to use the `ip-whoer` CLI command from anywhere):

```bash
npm install -g yourusername/ip_whoer
```

## Usage

### As a Module

```js
const { getIpInfo } = require("ip_whoer");

(async () => {
  const info = await getIpInfo();
  console.log(info);
})();
```

### CLI

```bash
npx ip-whoer
```

Or after a global install:

```bash
npm install -g ip_whoer
ip-whoer
```

## Example Output

```json
{
  "ip": "154.161.104.26",
  "ipv6": "N/A",
  "country": "Ghana",
  "countryCode": "GH",
  "region": "Ashanti Region",
  "city": "Kumasi",
  "isp": "Scancom [MTNGhana] Mobile Subscribers",
  "dns": "74.63.17.244 (United States)",
  "timezone": "Africa/Accra",
  "localTime": "Wed Mar 11 2026 23:41:48 GMT+0000 (GMT)"
}
```

## License

MIT
