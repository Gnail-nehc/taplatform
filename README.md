【referenced packages】
accounts-password
aldeed:collection2
anti:i18n
aslagle:reactive-table
cfs:filesystem
cfs:graphicsmagick
cfs:gridfs
cfs:standard-packages
email
fortawesome:fontawesome
ian:accounts-ui-bootstrap-3
iron:router
juliancwirko:s-alert
maazalik:highcharts
matdutour:popup-confirm
meteorhacks:aggregate
twbs:bootstrap
u2622:persistent-session
underscore
meteor add percolate:synced-cron

【deploy steps】
【precondition】just support node 0.10.X version; don't build tar.gz from windows machine

1.meter build <folder of meteor project source code>
2.tar -zxvf taplatform.tar.gz && rm taplatform.tar.gz
3.cd bundle/server
4.npm install fibers@1.0.5
5.cd bundle/programs/server
6.npm install
7.PORT=80 ROOT_URL=http://localhost MONGO_URL=mongodb://localhost:27017/taplatform node /opt/webapp/bundle/main.js

【start mongodb】
mongod --dbpath=/opt/software/mongodb-linux-x86_64-ubuntu1404-3.0.4/data --logpath=/opt/software/mongodb-linux-x86_64-ubuntu1404-3.0.4/logs --logappend  --port=27017 --maxConns=2000 --fork

【mongo backup】
mongodump -h 127.0.0.1 -d taplatform -o /home/ykse/taplatform_dump

【mongo restore】
mongorestore -d taplatform /home/ykse/taplatform_dump
