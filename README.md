wordsoup
========

Installation
============

1. Install couchdb - apt-get install couchdb
2. In /etc/apache2/httpd.conf add:
    LoadModule proxy_module /usr/lib/apache2/modules/mod_proxy.so
    LoadModule proxy_http_module /usr/lib/apache2/modules/mod_proxy_http.so
    ProxyPass /couchdb http://localhost:5984
3. $ curl -X PUT http://localhost/couchdb/wordsoup
4. $ curl -X PUT http://localhost/couchdb/wordsoup/record -d '{"high_score":0,"best_word":"","best_word_score":0,"longest_word":""}'
5. Download Typo.js and link/move typo/ to wordsoup/scripts/lib/
6. Download Hunspell en_GB dictionary (e.g. from http://en-gb.pyxidium.co.uk/dictionary/OOo.php) and locate en_GB.dic and en_GB.aff in wordsoup/scripts/lib/typo/dictionaries/
6. Link wordsoup folder to /var/www/
