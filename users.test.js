const { GenericContainer, Wait } = require("testcontainers");
//const mysql = require('mysql');
//const { createPool } = require('mysql2/promise')
const { Client } = require('pg')

jest.setTimeout(3000000);

describe("GenericContainer", () => {

    let container;
    let client;

    beforeAll(async () => {
        container = await new GenericContainer("postgres")
        .withExposedPorts(5432)
        .withWaitStrategy(Wait.forLogMessage("server started")).start();
        console.log('Container started');
    });

    beforeEach(async () => {
        client = new Client({
            user: 'dbuser',
            host: container.getHost(),
            database: 'mydb',
            password: 'secretpassword',
            port: container.getMappedPort(5432),
        })
        await client.connect(); 
        /* connection = await createPool({ 
            host: container.getHost(), 
            user: 'root', password: '', 
            port: container.getMappedPort(3306) 
        }) */
        console.log('Connected to database');
    })

    it("works", async () => {
        try {
            const res = await client.query('SELECT $1::text as message', ['Hello world!'])
            console.log(res.rows[0].message)
            
            //console.log(await (connection.query('SELECT count(*) FROM information_schema.columns')))

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