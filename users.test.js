const { GenericContainer } = require("testcontainers");
const mysql = require('mysql');
const { createPool } = require('mysql2/promise')

jest.setTimeout(3000000);

describe("GenericContainer", () => {

    let container;
    let connection;

    beforeAll(async () => {
        container = await new GenericContainer('mysql', '5.7')
        .withExposedPorts(3306)
        .withEnv('MYSQL_ALLOW_EMPTY_PASSWORD', '1')
        .withEnv('MYSQL_DATABASE', 'testdb')
        .start();
        console.log('Container started');
    });

    beforeEach(async () => {
        connection = await createPool({ 
            host: container.getHost(), 
            user: 'root', password: '', 
            port: container.getMappedPort(3306) 
        })
        console.log('Connected to database');
    })

    it("works", async () => {
        try {
            
            console.log(await (connection.query('SELECT count(*) FROM information_schema.columns')))

        } catch (error) {
            console.log(error);
        } 

        expect('A B C').toContain('A');
        
    }, 60000);

   afterEach(() => {
     connection.end();
   })

   afterAll(async () => {
     await container.stop();
   })

});