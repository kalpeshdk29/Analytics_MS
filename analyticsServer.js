const amqp = require('amqplib');
const dotenv = require("dotenv").config();
const connectDB = require('./dbConnection')
const {
    handleApiCallLogs,
    handleErrorLogs 
}   = require('./Helpers/APIDataHandler')

connectDB()

async function consumeMessages() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('analyticsQueue');

    channel.consume('analyticsQueue', async (msg) => {
        console.log(msg.content.toString());
        if (msg !== null) {     
            const data = JSON.parse(msg.content.toString());
            if(data.type === "apiCallLog"){
                await handleApiCallLogs(data.data);
            }else if(data.type === "errorLog"){
                await handleErrorLogs(data.data);
            }
            channel.ack(msg)
        }
    });

    console.log("amqp server is connected") 
}

consumeMessages().catch(console.error);
