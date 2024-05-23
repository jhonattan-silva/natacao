module.exports = function(app, db) { //tudo que usa o app do express aqui dentro e o app e o banco como parametros
    app.get('/buscarEquipes', function(req, res) {
        var equipe = req.query.equipe;
        var sql = 'SELECT id, nome FROM equipes WHERE nome LIKE ?';
        db.query(sql, ['%' + equipe + '%'], function(err, results) {
        if(err) {
            console.error(err);
            res.status(500).send('Erro ao buscar equipes');
            return;
        }     
        const equipes = results.map(equipe => {
            return {
              id: equipe.id,
              nome: equipe.nome
            };
          });

            res.json(equipes);
        
        });
    });



    app.post('/salvarNadador', function (req, res) {
        var nome = req.body.nome;
        var cpf = req.body.cpf;
        var sexo = req.body.sexo;
        var data_nasc = req.body.data_nasc;
        var telefone = req.body.telefone;
        var idEquipe = req.body.idEquipe; // Obtém o ID da equipe escolhida anteriormente

        
        // Verifica se o CPF já está cadastrado
        var duplicado = 'SELECT id FROM nadadores WHERE cpf = ?';
        db.query(duplicado, [cpf], function(err, results) {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao verificar CPF');
                return;
            }
            
            if (results.length > 0) {
                // CPF já está cadastrado
                res.status(400).json({ message: 'CPF já cadastrado' });
            } else {
                // CPF não está cadastrado, prossegue com a inserção
                var insertSql = 'INSERT INTO nadadores (nome, cpf, sexo, data_nasc, telefone, equipes_id) VALUES (?, ?, ?, ?, ?, ?)';
                db.query(insertSql, [nome, cpf, sexo, data_nasc, telefone, idEquipe], function(err, results) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Erro ao salvar nadador');
                    } else {
                        res.json({ message: 'Nadador salvo com sucesso!' });
                    }
                });
            }
        });
    });
}//FECHA O MODULE EXPORTS