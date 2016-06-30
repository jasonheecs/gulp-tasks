# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

    config.vm.box = "scotch/box"
    config.vm.network "private_network", ip: "192.168.33.10"
    config.vm.hostname = "scotchbox"
    config.vm.synced_folder ".", "/var/www", :nfs => { :mount_options => ["dmode=777","fmode=666"] }    

    config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get upgrade -y
    sudo apt-get install php5-xdebug
    echo 'echo "xdebug.var_display_max_data=-1" >> /etc/php5/apache2/php.ini' | sudo -s
    echo 'echo "xdebug.var_display_max_children=-1" >> /etc/php5/apache2/php.ini' | sudo -s
    echo 'echo "xdebug.var_display_max_depth=-1" >> /etc/php5/apache2/php.ini' | sudo -s
    sudo service apache2 restart
SHELL

end
