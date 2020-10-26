---
layout: default
title: Open Makerverse
parent: Tutorial
nav_order: 1
---

# Open Makerverse

If you used a [Stand-Alone installation](/installation/stand-alone/), Makerverse should already be open and running.

# Web Browser

To connect to Makerverse from **any internet browser** on the same network, you first need to know the **address** and **port** of Makerverse.

_**Tip**: with the Raspberry Pi image, the address is `makerverse.local` and the default port is `80`. On all other installations, the default port is `8000`._

The **address** of Makerverse can be the IP address of the computer on the network, or the name of that computer. Here's [how to find your hostname](https://computing.cs.cmu.edu/help-support/find-hostname) or IP address. Now, put the two together into your internet browser:

```
http://[hostname-or-ip]:[port]/
```

_**Tip**: if you use port 80, you don't need to include the port_.

## Examples

### Raspberry Pi installation

`makerverse.local` + port `80`: [http://makerverse.local/](http://makerverse.local/)

### Using a Hostname

`mycomputer.local` + port `8000`: [http://mycomputer.local:8000/](http://mycomputer.local:8000/)

### Using an IP address

IP `192.168.0.100` + port `8000`: [http://192.168.0.100:8000/](http://192.168.0.100:8000/)

# Troubleshooting

If your browser fails to connect to Makerverse, first make sure you have typed `http://` correctly (sometimes `https://` is inserted automatically).

Next, check that you can access Makerverse on the same computer which is running Makerverse. Instead of the IP address or hostname, just use `localhost`. For example, try to open a web browser on the same computer to `http://localhost:8000`. If that works, then something about your network (e.g., firewall) is preventing the second computer from talking to the Makerverse computer. If it does not work, then Makerverse is not actually running.
