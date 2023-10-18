const mqtt = require('mqtt')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const { GoogleSpreadsheet }=require('google-spreadsheet');
const {JWT}=require('google-auth-library');
const dotenv=require("dotenv");
dotenv.config();


const url = `mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`
const conf = {
    clientId: process.env.MQTT_CLIENT,
    clean: true,
    connectTimeout: 4000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,
}


// create .env file and transfer hard coded to .env file
const connect = async() => {
    const logPath = path.resolve(__dirname, 'mqtt.log');

    var clientmqtt = mqtt.connect(`${process.env.API}`, {
        username: 'gvcsnv',
        password: 'snv@220787'
    });

    clientmqtt.on('connect', function () {
        console.log('connected to cloudmqtt');
        clientmqtt.subscribe('GVC/VM/#');
    });

   

    clientmqtt.on('message',async(topic, message)=> {
        // message is Buffer 
        //console.log(message.toString());
        // example *12345,SUM,BST,1,2,3,4,5,6,7,8#

        
       
        var payload = message.toString();  
        payload = payload.replace('*','');
        payload = payload.replace('#','') ;
        //console.log(payload);    
        const parts = payload.split(',');
        var from = topic.replace('GVC/VM/','');
        if (parts[0] == 'SSN'){
            console.log('From -',from,'  To -',parts[1]);
            
            const serviceAccountAuth = new JWT({
                // env var values here are copied from service account credentials generated by google
                // see "Authentication" section in docs for more info
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY,
                scopes: [
                  'https://www.googleapis.com/auth/spreadsheets',
                ],
              });
              
              const doc = new GoogleSpreadsheet('1xxdNkuV6359yEQwGmYSEfoT1uuFFFz8bYCINDK9caZU', serviceAccountAuth);
              
              await doc.loadInfo(); // loads document properties and worksheets
              console.log(doc.title);
              await doc.updateProperties({ title: 'MQQT' });
              
              const sheet = doc.sheetsByIndex[0];
              const Headers=["Date",'Time','From','To']
              
              // const sheet = await doc.addSheet({ headerValues: ['name', 'email'] });
              await sheet.setHeaderRow(Headers);
              
              const currentDate = new Date();

// Get the year, month, and day components
const year = currentDate.getFullYear().toString().slice(-2); // Get the last two digits of the year
const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Month is 0-based, so add 1
const day = ('0' + currentDate.getDate()).slice(-2);

const hours = ('0' + currentDate.getHours()).slice(-2);
const minutes = ('0' + currentDate.getMinutes()).slice(-2);
const seconds = ('0' + currentDate.getSeconds()).slice(-2);

              await sheet.addRow({"Date":`${year}-${month}-${day}`,"Time":`${hours}:${minutes}:${seconds}`,"From":from,"To":parts[1] });
            //   await sheet.addRows(dataArray); // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
              console.log(sheet.title);
            }
        else
            return;




        // save current date in yy-mm-dd, current time in HH:MM:SS , from , to


        // check length of parts 
        // remove * from parts[0] and # from parts[lenth]
        //

        // save to google drive
        // write code here


        fs.appendFile(logPath, `[${moment().format()}]\n${message}\n\n`, err => {
            console.log(err)
        });


    });
    //    return client;
}

console.log("Starting Code");
connect();