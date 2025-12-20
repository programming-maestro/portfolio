
ga.js              → loads GA4
analytics.js       → attribution + device context
template.js        → UI / theme / layout

analytics.js   → detect + store (localStorage only)
ga.ts          → read + send to GA4

======================
Local Hosting:
1. for windows
cmd admin: netsh advfirewall firewall add rule name="Python HTTP Server 8000" dir=in action=allow protocol=TCP localport=8000

2.
python -m http.server 8000 --bind 0.0.0.0
======================