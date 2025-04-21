---
layout: distill
title: Introduction to DNS
description: The phone book of the internet is basically a DNS.
date: 2025-03-16
draft: true
tags:
  - dns
  - system-design
  - networks
category: DNS
---

## What is DNS?

{% include figure.liquid loading="eager" path="assets/img/bricks/dns/dns-introduction-figure1.svg" class="img-fluid rounded" %}
DNS stands for Domain Name System, It's a service the maps the human-friendly names to machine readable IP address. At a high level, you can think of it as a lookup table where domain names are mapped to their respective IP addresses (although the actual process is more complex).

## What happens when you enter an address in your browser?

{% include figure.liquid loading="eager" path="assets/img/bricks/dns/dns-introduction-figure2.png" class="img-fluid rounded" %}
When you visit a website, such as `traceintime.com`, your browser cannot send an HTTP Request to a domain name until it knows the actual IP address. For that, it embarks on a discovery journey to determine the actual location of traceintime.com and where the request should be directed by contacting a DNS resolver.

{% include figure.liquid loading="eager" path="assets/img/bricks/dns/dns-introduction-figure3.svg" class="img-fluid rounded" %}

1. The user enters a website domain name e.g. `traceintime.com` in the browser.
2. Since the browser doesn't recognize traceintime.com, it sends a DNS query to a resolver.
3. The resolver checks its cache for a stored IP address; if unavailable, it forwards the request to a DNS server.
4. The DNS server responds with the corresponding IP address.
5. Done!

{% include figure.liquid loading="eager" path="assets/img/bricks/dns/dns-introduction-figure4.png" class="img-fluid rounded" %}
That's basically how it looks in your browser request timeline As you've noticed, the connection started, then a DNS Lookup operation took place and in turn the connection was initiated after acknowledging the server's IP address.

> **Note:** The entire operation happens in a fraction of the second, and that is because of the way Domain Name Systems were designed and optimized for reads.

**Does it mean i can actually visit a website by it's IP Address?**

Yes and No! If the target IP address hosts only one website, you can likely access it directly. However, if the server uses <abbr title="hosting multiple websites on the same IP"> [virtual hosting](https://www.wikiwand.com/en/articles/Virtual_hosting)</abbr>, the domain name is required to determine which specific website you want to visit.

> **Note:** virtual hosting is not the only thing that prevents you from visiting a website by it's IP address (more on that later).

## Next

In the next article, we'll delve more on the hierarchy of DNS.
