const amqp = require('amqplib');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const connectDB = require('./dbConnection')
const ApiAnalyticsModel =require('./Model/API_AnalyticsSchema')

connectDB()



async function consumeMessages() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('analytics_queue');

    channel.consume('analytics_queue', async (msg) => {
        if (msg !== null) {        
            const message = JSON.parse(msg.content.toString());
            console.log("Message: ", message)
            try{
                const ApiAnalytics = new ApiAnalyticsModel(message);
                await ApiAnalytics.save();
                channel.ack(msg);
            }catch(err){
                console.log("Error : ",err)
            }

        }
    });

    console.log("amqp server is connected") 
}

consumeMessages().catch(console.error);
