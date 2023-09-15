const express = require('express');

const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv/config');

// Init Server
const app = express();
const port = process.env.PORT;

app.use(morgan('dev'));

app.use(cors())
app.options('*', cors());

app.use(bodyParser.json());

//Live check
app.get('/live', (req, res, next) => res.status(200).send());

const chat = async (req, res, next) => {
    let response = null
    try {

        const options = {
            method: 'POST',
            baseURL: 'https://api.openai.com/v1/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer su apikey`
            },
            data: {
                "model": "su modelo",
                "prompt": req.body.prompt,
                "temperature": 0.1,
                "max_tokens": 1500,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0,
                "stop": ["_END"]
            }
        }

        const result = await axios(options);
        console.log('RESPUESTA CHATGPT - ', result.data);

        if (result.data) {
            const data = result.data
            const respuesta = data.choices[0].text;
            let texto_limpio = respuesta.replace(/\n/g, '').replace(/#/g, '');
            console.log('RESPUESTA - ', texto_limpio);
            response = {
                error: false,
                statusCode: 200,
                message: texto_limpio
            }
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        response = {
            error: true,
            statusCode: 500,
            message: 'Error to Insert Payment',
        };
        return res.status(400).json(response);
    }
};

// ChatGPT
app.post('/chat', chat);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
