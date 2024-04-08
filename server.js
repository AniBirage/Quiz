const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static('public'));

// API endpoint to serve quiz questions
app.get('/quiz', (req, res) => {
    const questions = JSON.parse(fs.readFileSync('questions.json'));
    res.json(questions);
});

// API endpoint to handle quiz submissions
app.post('/submit', (req, res) => {
    const userAnswers = req.body.answers;
    const questions = JSON.parse(fs.readFileSync('questions.json'));
    let score = 0;

    // Calculate score
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].answer) {
            score++;
        }
    }

    // Send score to the user
    res.json({ score: score, total: questions.length });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
