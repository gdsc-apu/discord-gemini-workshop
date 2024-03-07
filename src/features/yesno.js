const axios = require('axios');

async function getYesNo() {
    try {
        let response = await axios.get('https://yesno.wtf/api');
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getYesNo };