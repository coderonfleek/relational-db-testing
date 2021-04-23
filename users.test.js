const { GenericContainer, Wait } = require("testcontainers");
//const mysql = require('mysql');
const { createPool } = require('mysql2/promise')
const faker = require('faker');

jest.setTimeout(3000000);

describe("GenericContainer", () => {

    let container;
    let connection;

    /* beforeAll(async () => {
        container = await new GenericContainer('mysql', '5.7')
        .withExposedPorts(3306)
        .withStartupTimeout(120000)
        .withEnv('MYSQL_ALLOW_EMPTY_PASSWORD', '1')
        .withEnv('MYSQL_DATABASE', 'testdb')
        .start();
        console.log('Container started');
    }); */

    beforeEach(async () => {

        let createTableSQL = "CREATE TABLE `users` ( `id` INT(2) NOT NULL AUTO_INCREMENT , `name` VARCHAR(100) NOT NULL , `email` VARCHAR(50) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;"
        
        connection = await createPool({ 
            host: "mysql-28850-0.cloudclusters.net", 
            user: 'testuser', password: 'password', 
            port: 28850,
            database: 'mytestdb'
        })
        console.log('Connected to database');

        await connection.query(createTableSQL);
    })

    it("works", async () => {
        try {

            const total_test_users = 3;
            let insertQueries=[];

            for (let i = 0; i < total_test_users; i++) {

                let insertSQL = `INSERT INTO users (id, name, email) VALUES (NULL, '${faker.name.findName()}', '${faker.internet.email()}');`;

                insertQueries.push(connection.query(insertSQL))
                
            }

            await Promise.all(insertQueries);
            
            
            //console.log(await (connection.query('SELECT count(*) FROM information_schema.columns')));
            //await connection.query(insertSQL);
            const [rows, fields] = await connection.query('SELECT * FROM users');
            console.log(rows);

            expect(rows.length).toBe(total_test_users);

        } catch (error) {
            console.log(error);
            let dropTableSQL = "DROP TABLE IF EXISTS `users`";
            await connection.query(dropTableSQL);
            await connection.end();
        } 

        
        
    }, 60000);

   afterEach(async () => {
     let dropTableSQL = "DROP TABLE IF EXISTS `users`";
     await connection.query(dropTableSQL);
     await connection.end();
   })

   /* afterAll(async () => {
     await container.stop();
   }) */

});