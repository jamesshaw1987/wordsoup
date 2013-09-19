wordsoup
========

Installation
============

1. Install couchdb - apt-get install couchdb
2. In /etc/apache2/httpd.conf add:
    LoadModule proxy_module /usr/lib/apache2/modules/mod_proxy.so
    LoadModule proxy_http_module /usr/lib/apache2/modules/mod_proxy_http.so
    ProxyPass /couchdb http://localhost:5984
3. Link wordsoup folder to /var/www/
