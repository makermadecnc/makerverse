---
layout: default
title: Security
parent: Features
nav_order: 8
---

# Security

Makerverse protects access to your machine(s) with an account/log-in system.

## Account Creation

When you create (or log in) to your account, it prevents your Makerverse installation from being accessed by malicious parties. The Makerverse account system is powered by OpenWorkShop (a for-Benefit organization, part of the Makerverse open-source initiative). You can create an account with just an email address (or use Github, Google, etc. to login).

## Offline Usage

When you first install Makerverse and log in to your account, an internet connection is required. After that point, Makerverse will continue to work even if there is no internet available.

## Password Recovery

If at any point you become locked out of your account, you can reset your password using the email address you used to create the account.

## Potential Safety Hazards

Though it may sound extreme, accounts are meant to protect against potential safety hazards.

Makerverse can run large-scale heavy CNC machinery, laser cutters, plasma torches, and more. Many users enable full remote control over these tools, including the ability to turn them on and off via a web browser. It would be entirely possible for an uninformed guest to cause accidental human harm with such tools. Thus, accounts ensure that even well-intentioned guests cannot use the system.

## Technical Explanation

There's a good blog post by the folks at Octoprint about [why accounts are needed for security purposes](https://octoprint.org/blog/2018/09/03/safe-remote-access/). The blog post notes that [security researchers have found](https://isc.sans.edu/forums/diary/3D+Printers+in+The+Wild+What+Can+Go+Wrong/24044/) _thousands of totally exposed ("don't even need to hack them") OctoPrint installations_. The blog post doesn't discuss public (or poorly-secured) networks, but there are doubtlessly **many times more** installations vulnerable to hacking along this attack vector.

_**Note**: despite the above security report, the folks behind OctoPrint are extremely diligent in this matter. We simply feel that a tool like Makerverse, which comes with the above hazards, should make it **easier** to be secure than insecure._

## Philosophy

To prevent this from ever becoming a problem with Makerverse, we made the decision to be "secure by default." Using a centralized authority (OpenWorkShop) allows authentication to happen via HTTPS (encrypted channels). Unlike with a "local-login," _your password is never transmitted via HTTP_. Moreover, OpenWorkShop uses modern security best-practices (OAuth, as opposed to a simple username/password) and open-source security libraries (`oidc-client`). This means that even someone who has hacked your WiFi network will be unable to see your login credentials.

If you still want to enable guest mode, despite the potential hazards, see the "advanced" features.
