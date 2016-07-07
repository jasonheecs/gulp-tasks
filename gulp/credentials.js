/**
 * Credentials for gulp deployment tasks. Remember to not to commit this file to public repos!!
 */

module.exports = {
    ftp: {
        host: 'efusiondemo.info',
        username: 'testing@efusiondemo.info',
        password: 'efusion987$$',
        directory: '/testing'
    },
    db: {
        local: {
            host: 'localhost',
            db_name: 'scotchbox',
            username: 'root',
            password: 'root',

            // set ssh credentials if using vagrant box
            ssh: {
                host: '192.168.33.10',
                username: 'vagrant',
                password: 'vagrant'
            }
        }
    }
};