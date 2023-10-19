'use strict';
module.exports = (sequelize, DataTypes) => {
  const MQTT = sequelize.define('MqttMessage', {
     date:DataTypes.STRING,
     time:DataTypes.STRING,
     from:DataTypes.STRING,
     to:DataTypes.STRING
  }, {
    tableName: 'MqttMessage',
   
  });
  MQTT.associate = function(models) {
    // associations can be defined here
  };
  return MQTT;
};