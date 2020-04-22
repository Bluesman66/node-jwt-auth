require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.json());

const jwt = require('jsonwebtoken');

let refreshTokens = [];

app.post('/login', (req, res) => {
	// authenticate user
	const username = req.body.username;
	const user = { name: username };
	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user);
	refreshTokens.push(refreshToken);
	res.json({ accessToken, refreshToken });
});

app.post('/token', (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken == null) return res.sendStatus(401);
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		const accessToken = generateAccessToken({ name: user.name });
		res.json({ accessToken });
	});
});

app.delete('/logout', (req, res) => {
	refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
	res.sendStatus(204);
});

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
}

function generateRefreshToken(user) {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

app.listen(3000);
