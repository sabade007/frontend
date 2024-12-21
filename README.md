## etheros-frontend

git clone http://gitlabs.exzatechconsulting.net/jadhav/etheros-frontend.git


npm install

ionic serve --port 4200

build the package by using the command in the base directory.

$ ionic build --disableHostCheck --prod -- --base-href=/etheros/

Note: httpd.conf should be modified according to your build command --base-href=/etheros/
Ex: Alias ` /etheros/ ` /var/www/html/
