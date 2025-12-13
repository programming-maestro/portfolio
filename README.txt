Static portfolio site for Chetan Maikhuri. Open index.html in a browser (file:// or via localhost). Header/footer are injected via assets/js/template.js. PDFs are in assets/pdfs/.


======================
Local Hosting:
1.
cmd admin: netsh advfirewall firewall add rule name="Python HTTP Server 8000" dir=in action=allow protocol=TCP localport=8000

2.
python -m http.server 8000 --bind 0.0.0.0
======================