var express = require('express');
var router = express.Router();
var pg = require('pg');
var connString = process.env.DATABASE_URL;

router.post('/test', function (req, res, next) {
    res.json({
        message: req.body
    });
});

router.post('/volontari/info', function (req, res, next) {
    res.json({
        codice: req.user.codice,
        nome: req.user.nome,
        cognome: req.user.cognome,
        foto: req.user.foto
    });
});

router.post('/turni/list', function (req, res, next) {
    pg.connect(connString, function (err, client, done) {
        if (err) return next(err);
        client.query('SELECT percorso, volontario, p.nome, tipo, giorno FROM turni JOIN percorsi p ON percorso = p.id JOIN volontari v ON v.codice=volontario WHERE user_id = $1', [req.user.id], function (err, result) {
            res.json({
                success: true,
                result: result.rows
            });
        });
    });
});

router.post('/turni/start', function (req, res, next) {
    pg.connect(connString, function (err, client, done) {
        if (err) return next(err);
        client.query('select report.id as report, turni.id as turno from turni left join report on turni.id = turno and report.data = cast(now() as date) where volontario = $1 and percorso = $2 and giorno = ((cast(now() as date) - \'03/14/2016\') % 7)', [req.user.codice, parseInt(req.body.percorso)], function (err, result) {
            if (err) return next(err);
            if (result.rowCount) {
                if (!result.rows[0].report)
                    return res.json({ message: 'Sei autorizzato ad effettuare questo turno' });
            }
            return res.status(401).json({ message: 'Non sei autorizzato ad aprire il report' });
        });
    });
});

router.post('/percorso/bambini', function (req, res, next) {
    res.json({
        message: 'Hai raggiunto l\'indice'
    });
});

router.post('/percorso/bambini/registra', function (req, res, next) {
    res.json({
        message: 'Hai raggiunto l\'indice'
    });
});

router.post('/percorso/bambini/contatti', function (req, res, next) {
    res.json({
        message: 'Hai raggiunto l\'indice'
    });
});

router.post('/percorso/chiudi', function (req, res, next) {
    res.json({
        message: 'Hai raggiunto l\'indice'
    });
});

module.exports = router;
