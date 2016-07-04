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
            db_name: 'dummy',
            username: 'root',
            password: 'root'
        }
    }
};