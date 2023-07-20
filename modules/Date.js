const moment = require("moment");

exports.timestamp = function() {

    var Months = {
         "01": "January",
         "02": "February",
         "03": "March",
         "04": "April",
         "05": "May",
         "06": "June",
         "07": "July",
         "08": "August",
         "09": "September",
         "10": "October",
         "11": "November",
         "12": "December"
    };

    return `[${moment(Date.now()).format('DD')} ${Months[moment(Date.now()).format('MM')]} ${moment(Date.now()).format('YYYY')} ${moment(Date.now()).format('• HH:mm:ss')}]`;

};
