var axios = require('axios');

TELEGRAM_API_TOKEN = '<ur telegram token>'
let telegram_url = "https://api.telegram.org/bot" + TELEGRAM_API_TOKEN + "/sendMessage";


/**This has to be executed in Postman to set the web hook. bot is followed by the telegram token
 * 
 * https://api.telegram.org/bot<token>/setwebhook
 * {
    "url": "<catalyst function url>"
}
 */
module.exports = (context, basicIO) => {

    var info = basicIO.getAllArguments();
    console.log(info);

    async function shortenURL(info, context) {

        var message;
        message = info.edited_message;
        console.log(message);
        if (message == undefined) {
            message = info.message;
        }
        const { chat, text } = message;
        console.log(chat);
        console.log(text);
        if (text != null && text != '') {
            try {
                const result = await getShortUrl(text);
                if (result != "Error") {

                    message = '-- Shortened URL --    ' + result.result_url;
                    console.log('Shortened URL : ' + message);
                    await sendToUser(chat.id, message, context);
                } else {
                    message = 'Provide input like https://en.wikipedia.org/wiki/Yahoo!_Games';
                    await sendToUser(chat.id, message, context);
                }

            } catch (error) {
                message = "Provide input like https://en.wikipedia.org/wiki/Yahoo!_Games";
                await sendToUser(chat.id, message, context);
            }

        } else {
            await sendToUser(chat.id, 'Proper city name is expected.', context);
        }

    }


    async function sendToUser(chat_id, text, res) {
        console.log('in send  ' + text);
        axios.post(telegram_url, {
            chat_id: chat_id,
            text: text
        }).then(response => {
            console.log("Message posted");
            context.close();
        }).catch(error => {
            console.log(error);
            context.close();
        });

    }



    async function getShortUrl(url) {
        console.log('url is  ' + url);
        try {
            var result = await axios.post('https://cleanuri.com/api/v1/shorten', {
                url: url
            });
            return result.data;
        } catch (error) {
            // console.log(JSON.stringify(error));
            console.log(error.name);
            return error.name;
        }

    }
    shortenURL(info, context);
};
