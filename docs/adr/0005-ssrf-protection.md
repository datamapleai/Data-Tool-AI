# SSRF protection via DNS resolution guard

All external URL fetching (auto-fill, preview) goes through a guard that resolves the target DNS and blocks private/loopback ranges before making the HTTP request. Blocked ranges: localhost, 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16 (including cloud metadata at 169.254.169.254), and IPv6 ULA/loopback.

This prevents server-side request forgery attacks where a malicious URL could probe internal services. The guard is applied at the library level (`lib/ssrf.ts`) and all fetch operations must pass through it.
