wordsoup
========

Installation
============

1. Install couchdb - apt-get install couchdb
2. In /etc/apache2/httpd.conf add:
    LoadModule proxy_module /usr/lib/apache2/modules/mod_proxy.so
    LoadModule proxy_http_module /usr/lib/apache2/modules/mod_proxy_http.so
    ProxyPass /couchdb http://localhost:5984
3. Download Typo.js and link/move typo/ to wordsoup/scripts/lib/
4. Download Hunspell en_GB dictionary (e.g. from http://en-gb.pyxidium.co.uk/dictionary/OOo.php) and locate en_GB.dic and en_GB.aff in wordsoup/scripts/lib/typo/dictionaries/
5. Link wordsoup folder to /var/www/
