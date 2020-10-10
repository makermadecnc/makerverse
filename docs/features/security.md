---
layout: default
title: Security
parent: Features
nav_order: 9
---

# Security

Makerverse protects access to your machine(s) with an account/log-in system.

## Account Creation

When you create (or log in) to your account, it prevents your Makerverse installation from being accessed by malicious parties. The Makerverse account system is powered by OpenWorkShop (a for-Benefit organization, part of the Makerverse open-source initiative). You can create an account with just an email address (or use Github, Google, etc. to login).

## Offline Usage

When you first install Makerverse and log in to your account, an internet connection is required. After that point, Makerverse will continue to work even if there is no internet available.

## Password Recovery

If at any point you become locked out of your account, you can reset your password using the email address you used to create the account.

## Detailed Explanation

There's a good blog post by the folks at Octoprint about [why accounts are needed for security purposes](https://octoprint.org/blog/2018/09/03/safe-remote-access/). The blog post notes that [security researchers have found](https://isc.sans.edu/forums/diary/3D+Printers+in+The+Wild+What+Can+Go+Wrong/24044/) _thousands of exposed (hackable) OctoPrint installations_. The blog post doesn't discuss public (or poorly-secured) networks, but there are doubtlessly **many times more** installations vulnerable to hacking along this attack vector.

To prevent this from ever becoming a problem with Makerverse, we made the decision to require secure login from the very beginning. Using a centralized authority (OpenWorkShop) allows authentication to happen via HTTPS (encrypted channels). Unlike with a "local-login," _your password is never transmitted via HTTP_. Moreover, OpenWorkShop uses modern security best-practices (OAuth, as opposed to a simple username/password) and open-source security libraries (`oidc-client`). This means that even someone who has hacked your WiFi network will be unable to see your login credentials.
