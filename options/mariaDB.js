const options = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'ecommerceDb'
    }
}

console.log('Conectando a la base de datos maríaDb...');

module.exports = {
    options
}