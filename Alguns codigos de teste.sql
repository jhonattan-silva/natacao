INSERT INTO Torneios (nome, data_inicio, data_fim) VALUES
('2024', '2024-01-01', '2024-12-31'),
('2025', '2025-01-01', '2025-12-31');

INSERT INTO Equipes (nome) VALUES
('Equipe Duartina'),
('Equipe Garça'),
('Equipe Tubarão'),
('Sol Raiante'),
('Assis Natação ATC/SEMEA'),
('Clube Esportivo Marimbondo'),
('Aitec Sandalus/Natação Tupã'),
('SMEL CATANDUVA'),
('Dudu Acqua Center'),
('Natação Duartina'),
('Clube Penapolense/SME Penapolis'),
('Prefeitura de Guaiçara - Triunfo/Transbrasiliana'),
('Lago Azul Penapolis'),
('Lins Country Club'),
('Secretaria de Esportes Jaú'),
('Secretaria de Esportes e Lazer de Lins'),
('Kinesis Iacanga'),
('AAEEVA Natação'),
('Academia Agua Viva'),
('Natação Paraguaçu'),
('Academia Enforma'),
('Becara Swin Team'),
('Aprendendo a Nadar Lins/SP'),
('Natação Ourinhos'),
('Studio Mota'),
('Nadbem'),
('Saúde e Movimento'),
('Natação Birigui');


INSERT INTO eventos (nome, data, sede, cidade, endereco, torneios_id) VALUES
('1º Etapa', '2024-02-24', 'CEI Tupã', 'Tupã', NULL, 1),
('2º Etapa', '2024-03-16', 'Lins Contry Clube', 'Lins', NULL, 1),
('3º Etapa', '2024-04-13', 'Guaiçara', 'Guaiçara', NULL, 1),
('4º Etapa', '2024-05-11', 'Clube Marimbondo', 'Lençois Paulista', 'Avenida brasil, 1039', 1),
('5º Etapa', '2024-06-22', 'Assis Tênis Clube', 'Assis', 'Dr Alipio Correia Neto, 322', 1),
('6º Etapa', '2024-08-17', 'AABB Marilia', 'Marilia', 'Avenida brigadeiro eduardo gomes, 1000', 1),
('7º Etapa', '2024-09-21', 'CSU Lins', 'Lins', NULL, 1),
('8º Etapa', '2024-10-19', 'Clube Marimbondo', 'Lençois Paulista', 'Avenida brasil, 1039', 1),
('9º Etapa', '2024-11-09', 'Clube Penapolense', 'Penapolis', NULL, 1),
('10º Etapa', '2024-12-07', 'CEI Tupã', 'Tupã', '(Campeonato Paulista)', 1);


/* INSERT INTO tipoProvas (distancia, estilo, tipo) VALUES
(25, 'LIVRE', 'INDIVIDUAL'),
(50, 'LIVRE', 'INDIVIDUAL'),
(50, 'COSTAS', 'INDIVIDUAL'),
(50, 'PEITO', 'INDIVIDUAL'),
(50, 'BORBOLETA', 'INDIVIDUAL'),
(100, 'MEDLEY', 'INDIVIDUAL'),
(100, 'LIVRE', 'INDIVIDUAL'),
(100, 'COSTAS', 'INDIVIDUAL'),
(100, 'PEITO', 'INDIVIDUAL'),
(100, 'BORBOLETA', 'INDIVIDUAL'),
(200, 'LIVRE', 'INDIVIDUAL'),
(200, 'COSTAS', 'INDIVIDUAL'),
(200, 'PEITO', 'INDIVIDUAL'),
(200, 'BORBOLETA', 'INDIVIDUAL'),
(200, 'MEDLEY', 'INDIVIDUAL'),
(400, 'LIVRE', 'INDIVIDUAL'),
(400, 'MEDLEY', 'INDIVIDUAL'),
(800, 'LIVRE', 'INDIVIDUAL'),
(1.500, 'LIVRE', 'INDIVIDUAL'),
(100, 'LIVRE', 'REVEZAMENTO'),
(100, 'MEDLEY', 'REVEZAMENTO'),
(200, 'LIVRE', 'REVEZAMENTO'); */


INSERT INTO provas (distancia, estilo, tipo, sexo) VALUES
(25, 'LIVRE', 'INDIVIDUAL', 'M'),
(50, 'LIVRE', 'INDIVIDUAL', 'M'),
(50, 'COSTAS', 'INDIVIDUAL', 'M'),
(50, 'PEITO', 'INDIVIDUAL', 'M'),
(50, 'BORBOLETA', 'INDIVIDUAL', 'M'),
(100, 'MEDLEY', 'INDIVIDUAL', 'M'),
(100, 'LIVRE', 'INDIVIDUAL', 'M'),
(100, 'COSTAS', 'INDIVIDUAL', 'M'),
(100, 'PEITO', 'INDIVIDUAL', 'M'),
(100, 'BORBOLETA', 'INDIVIDUAL', 'M'),
(200, 'LIVRE', 'INDIVIDUAL', 'M'),
(200, 'COSTAS', 'INDIVIDUAL', 'M'),
(200, 'PEITO', 'INDIVIDUAL', 'M'),
(200, 'BORBOLETA', 'INDIVIDUAL', 'M'),
(200, 'MEDLEY', 'INDIVIDUAL', 'M'),
(400, 'LIVRE', 'INDIVIDUAL', 'M'),
(400, 'MEDLEY', 'INDIVIDUAL', 'M'),
(800, 'LIVRE', 'INDIVIDUAL', 'M'),
(1.500, 'LIVRE', 'INDIVIDUAL', 'M'),
(100, 'LIVRE', 'REVEZAMENTO', 'M'),
(100, 'MEDLEY', 'REVEZAMENTO', 'M'),
(200, 'LIVRE', 'REVEZAMENTO', 'M'),
(25, 'LIVRE', 'INDIVIDUAL', 'F'),
(50, 'LIVRE', 'INDIVIDUAL', 'F'),
(50, 'COSTAS', 'INDIVIDUAL', 'F'),
(50, 'PEITO', 'INDIVIDUAL', 'F'),
(50, 'BORBOLETA', 'INDIVIDUAL', 'F'),
(100, 'MEDLEY', 'INDIVIDUAL', 'F'),
(100, 'LIVRE', 'INDIVIDUAL', 'F'),
(100, 'COSTAS', 'INDIVIDUAL', 'F'),
(100, 'PEITO', 'INDIVIDUAL', 'F'),
(100, 'BORBOLETA', 'INDIVIDUAL', 'F'),
(200, 'LIVRE', 'INDIVIDUAL', 'F'),
(200, 'COSTAS', 'INDIVIDUAL', 'F'),
(200, 'PEITO', 'INDIVIDUAL', 'F'),
(200, 'BORBOLETA', 'INDIVIDUAL', 'F'),
(200, 'MEDLEY', 'INDIVIDUAL', 'F'),
(400, 'LIVRE', 'INDIVIDUAL', 'F'),
(400, 'MEDLEY', 'INDIVIDUAL', 'F'),
(800, 'LIVRE', 'INDIVIDUAL', 'F'),
(1.500, 'LIVRE', 'INDIVIDUAL', 'F'),
(100, 'LIVRE', 'REVEZAMENTO', 'F'),
(100, 'MEDLEY', 'REVEZAMENTO', 'F'),
(200, 'LIVRE', 'REVEZAMENTO', 'F');


INSERT INTO categorias (nome, sexo) VALUES 
('Pré-Mirim', 'M'),
('Mirim I', 'M'),
('Mirim II', 'M'),
('Petiz I', 'M'),
('Petiz II', 'M'),
('Infantil I', 'M'),
('Infantil II', 'M'),
('Juvenil I', 'M'),
('Juvenil II', 'M'),
('Junior I', 'M'),
('Junior II', 'M'),
('Sênior', 'M'),
('Iniciantes', 'M'),
('Pré-Mirim', 'F'),
('Mirim I', 'F'),
('Mirim II', 'F'),
('Petiz I', 'F'),
('Petiz II', 'F'),
('Infantil I', 'F'),
('Infantil II', 'F'),
('Juvenil I', 'F'),
('Juvenil II', 'F'),
('Junior I', 'F'),
('Junior II', 'F'),
('Sênior', 'F'),
('Iniciantes', 'F');

INSERT INTO nadadores (nome, cpf, sexo, data_nasc, telefone, equipes_id) VALUES 
('FELIPE AUGUSTO DOS SANTOS COSTA', '11111111112', 'M', '2013-01-01', '11987654342', 5),
('LUIZ OTÁVIO LIMA CAFERRO', '22222222223', 'M', '2013-02-02', '11987654343', 13),
('LUIZ ANTÔNIO CAMPIONI CAMPOS', '33333333334', 'M', '2013-03-03', '11987654344', 11),
('ENZO AVELLANEDA CALDEIRA', '44444444445', 'M', '2013-04-04', '11987654345', 7),
('DANIEL VASCONCELOS DOS SANTOS', '55555555556', 'M', '2013-05-05', '11987654346', 16),
('SAMUEL ARAUJO SIMAO', '66666666667', 'M', '2013-06-06', '11987654347', 16),
('MATEUS MICHELON CAMARGO', '77777777778', 'M', '2013-07-07', '11987654348', 7),
('BERNARDO VOLPE VARGAS', '88888888889', 'M', '2013-08-08', '11987654349', 11),
('OTAVIO PESIEKA TOMÉ VARGAS', '99999999990', 'M', '2013-09-09', '11987654350', 13),
('PEDRO MARQUETTI MARQUES', '10101010111', 'M', '2013-10-10', '11987654351', 12),
('JOÃO GUILHERME MONTANHA DA SILVA', '11111111122', 'M', '2013-11-11', '11987654352', 16),
('MARCOS ALVES DE MORAES', '12121212123', 'M', '2013-12-12', '11987654353', 6),
('Gabriel Monteiro dos Santos', '13131313134', 'M', '2013-01-13', '11987654354', 10),
('Pedro Lucas dos Santos Senatore', '14141414145', 'M', '2013-02-14', '11987654355', 13),
('BEN RESENDE BARBOSA', '15151515156', 'M', '2013-03-15', '11987654356', 5),
('PEDRO HENRIQUE VITOR LEAL', '16161616167', 'M', '2013-04-16', '11987654357', 13),
('PEDRO SABARANSKI NETO', '17171717178', 'M', '2013-05-17', '11987654358', 14),
('Arthur Morais Francisco', '18181818189', 'M', '2013-06-18', '11987654359', 27),
('Davi Luccas Santana Lucio', '19191919190', 'M', '2013-07-19', '11987654360', 25),
('Miguel Antonio Ferreira', '20202020211', 'M', '2013-08-20', '11987654361', 25),
('PEDRO HENRIQUE VITOR LEAL', '21212121222', 'M', '2013-09-21', '11987654362', 13),
('João Gabriel Carvalho de Santana', '22222222233', 'M', '2013-10-22', '11987654363', 17),
('ARTHUR BELENTANI DO SANTOS', '23232323234', 'M', '2013-11-23', '11987654364', 16),
('DAVI FERRIZZI ROTTA', '24242424245', 'M', '2013-12-24', '11987654365', 8),
('RAFAEL RODRIGUES MAGALHÃES', '25252525256', 'M', '2013-01-25', '11987654366', 5),
('JOÃO GABRIEL BUENO', '26262626267', 'M', '2013-02-26', '11987654367', 19),
('DAVI OLIVEIRA BINATO RAMIRES', '27272727278', 'M', '2013-03-27', '11987654368', 5),
('JOÃO RICARDO BINATO AIZZO', '28282828289', 'M', '2013-04-28', '11987654369', 5),
('BENJAMIN ROLF DIEM', '29292929290', 'M', '2013-05-29', '11987654370', 5),
('Enzo Gabriel Honorio', '30303030311', 'M', '2013-06-30', '11987654371', 18),
('FELIPE BONFIM REIS', '31313131322', 'M', '2013-07-31', '11987654372', 11),
('gustavo dos santos marquesi', '32323232333', 'M', '2013-08-01', '11987654373', 17),
('Thiago dos Santos melo filho', '33333333344', 'M', '2013-09-02', '11987654374', 20),
('GUSTAVO HENRIQUE A.MORELLI DE OLIVEIRA', '34343434355', 'M', '2013-10-03', '11987654375', 16),
('VINÍCIUS FITIPALDI DA SILVA', '35353535366', 'M', '2013-11-04', '11987654376', 5),
('MATHEUS ROBERTO PENACHINI', '36363636377', 'M', '2013-12-05', '11987654377', 5),
('Miguel mantovani Franco', '37373737388', 'M', '2013-01-06', '11987654378', 20),
('Bernardo Ruiz Tarifa', '38383838399', 'M', '2013-02-07', '11987654379', 7),
('JÚLIO GARCIA PEREZ', '39393939400', 'M', '2013-03-08', '11987654380', 5),
('YOHAN DE MATTOS QUINTO', '40404040411', 'M', '2013-04-09', '11987654381', 16),
('MATEUS SOARES BRITO', '41414141422', 'M', '2013-05-10', '11987654382', 11),
('Miguel dos Santos Barbosa', '42424242433', 'M', '2013-06-11', '11987654383', 7),
('PEDRO CAVENAGHI AGOSTINI', '11111111111', 'M', '2014-01-01', '11987654300', 11),
('ACACIO LOURENZO SANTOS DA CRUZ', '22222222222', 'M', '2014-02-02', '11987654301', 11),
('JAÕA ARTHUR PEREIRAMARCELINO', '33333333333', 'M', '2014-03-03', '11987654302', 16),
('DAVI BERTINOTTI DOS SANTOS', '44444444444', 'M', '2014-04-04', '11987654303', 10),
('JOAQUIM DOS SANTOS OLIVEIRA NETO', '55555555555', 'M', '2014-05-05', '11987654304', 8),
('Miguel Trugilio', '66666666666', 'M', '2014-06-06', '11987654305', 7),
('LORENZO BIANCHI AGUIAR', '77777777777', 'M', '2014-07-07', '11987654306', 16),
('Enzo Gabriel Poltronieri Nunes', '88888888888', 'M', '2014-08-08', '11987654307', 12),
('ITALO VIEIRA CEZÁRIO', '99999999999', 'M', '2014-09-09', '11987654308', 9),
('Willyam Antraco Tezzi de Souza', '10101010101', 'M', '2014-10-10', '11987654309', 10),
('Lucas Passos Calabria', '11111111110', 'M', '2014-11-11', '11987654310', 27),
('ENZO GABRIEL DA SILVA GRANADO', '12121212121', 'M', '2014-12-12', '11987654311', 6),
('ENZO GABRIEL ALBERTIN', '13131313131', 'M', '2014-01-13', '11987654312', 15),
('ARTHUR COSTA MARCATO PAIXAO', '14141414141', 'M', '2014-02-14', '11987654313', 14),
('PEDRO FRANCO BARRACHI', '15151515151', 'M', '2014-03-15', '11987654314', 16),
('Murilo Gimenes Lopes', '16161616161', 'M', '2014-04-16', '11987654315', 10),
('ISAAC DIAS ITO', '17171717171', 'M', '2014-05-17', '11987654316', 11),
('NICOLAS KAWAMOTO RODRIGUES DA SILVA', '18181818181', 'M', '2014-06-18', '11987654317', 11),
('RAFAEL PEREIRA BORETTI', '19191919191', 'M', '2014-07-19', '11987654318', 5),
('DAVI HOSTI GAVIRA', '20202020202', 'M', '2014-08-20', '11987654319', 11),
('FRANCISCO BATISTA GONÇALVES', '21212121212', 'M', '2014-09-21', '11987654320', 5),
('DANIEL DE LIMA SIMIÃO', '22222222221', 'M', '2014-10-22', '11987654321', 5),
('Leonardo Henrique de Oliveira Silva', '23232323232', 'M', '2014-11-23', '11987654322', 12),
('CAIO LIMA DE OLIVEIRA', '24242424242', 'M', '2014-12-24', '11987654323', 5),
('Davi Ferreira cano', '25252525252', 'M', '2014-01-25', '11987654324', 23),
('Joao Lucas Amaral Mendes', '26262626262', 'M', '2014-02-26', '11987654325', 23),
('JOSÉ NETO LOPES DAMASIO', '27272727272', 'M', '2014-03-27', '11987654326', 5),
('João Gabriel Silva Ribeiro', '28282828282', 'M', '2014-04-28', '11987654327', 12),
('BERNARDO BOGO COSTA', '29292929292', 'M', '2014-05-29', '11987654328', 11),
('GABRIEL RODRIGUES SEBASTIÃO', '30303030303', 'M', '2014-06-30', '11987654329', 8),
('HENRIQUE ANDRADE GALLI', '31313131313', 'M', '2014-07-31', '11987654330', 1),
('ARTHUR DIAS MORAIS', '32323232323', 'M', '2014-08-01', '11987654331', 1),
('VICENTE BONI MINATEL', '33333333333', 'M', '2014-09-02', '11987654332', 19),
('LEONARDO VICENTE ANESIO', '34343434343', 'M', '2014-10-03', '11987654333', 19),
('MIGUEL AUGUSTO VASSOLER', '35353535353', 'M', '2014-11-04', '11987654334', 19),
('ARTHUR BOCCA BUENO', '36363636363', 'M', '2014-12-05', '11987654335', 19),
('JOÃO PEDRO FRANCISCO NAKASIMA', '37373737373', 'M', '2014-01-06', '11987654336', 14),
('JOSE MIGUEL FRANCISCO NAKASIMA', '38383838383', 'M', '2014-02-07', '11987654337', 14),
('LUCAS SPAMPINATO KILL', '39393939393', 'M', '2014-03-08', '11987654338', 5),
('JORGE HENRIQUE PEREIRA COLEVATI', '40404040404', 'M', '2014-04-09', '11987654339', 11),
('MATEUS SOARES BRITO', '41414141414', 'M', '2014-05-10', '11987654340', 11),
('Miguel dos Santos Barbosa', '42424242424', 'M', '2014-06-11', '11987654341', 7),
('FRANCISCO NOGUEIRA GRANADO', '12345678901', 'M', '2015-01-01', '11987654321', 5),
('MATHEUS SALBEGO ALVES MAIA', '23456789012', 'M', '2015-02-02', '11987654322', 16),
('ARTHUR BRASIL CIMO', '34567890123', 'M', '2015-03-03', '11987654323', 5),
('Bernardo Alves Andreotti', '45678901234', 'M', '2015-04-04', '11987654324', 27),
('RAUL ZANATTO FERNANDES', '56789012345', 'M', '2015-05-05', '11987654325', 11),
('RAUL MIABARA BAGIO', '67890123456', 'M', '2015-06-06', '11987654326', 11),
('JOÃO GUILHERME GIANAZI CARVALHO', '78901234567', 'M', '2015-07-07', '11987654327', 5),
('Charles Scott dos Santos', '89012345678', 'M', '2015-08-08', '11987654328', 18),
('GABRIEL ROBERTO ERENO', '90123456789', 'M', '2015-09-09', '11987654329', 1),
('HEITOR RUIZ FERRAREZI', '11234567890', 'M', '2015-10-10', '11987654330', 8),
('Arthur Bernardino Santos', '22345678901', 'M', '2015-11-11', '11987654331', 13),
('HENRI FRANZO NASCIMENTO', '33456789012', 'M', '2015-12-12', '11987654332', 11),
('THEODORO HENRIQUE ALVES CAVALCANTE', '44567890123', 'M', '2015-01-13', '11987654333', 14),
('Miguel Anderson de Souza Onorio', '55678901234', 'M', '2015-02-14', '11987654334', 7),
('MARCO ANTÔNIO GIL MUNHOZ PEREIRA', '66789012345', 'M', '2015-03-15', '11987654335', 11),
('NOAH DE RESENDE BARBOSA', '77890123456', 'M', '2015-04-16', '11987654336', 5),
('ANDRE JOAO MONTANHA', '88901234567', 'M', '2015-05-17', '11987654337', 14),
('SAMUEL TORREZAN MARCHESI', '99012345678', 'M', '2015-06-18', '11987654338', 11),
('Leonardo Barros Teixeira', '10123456789', 'M', '2015-07-19', '11987654339', 18),
('RODRIGO JOAO MONTANHA', '21234567890', 'M', '2015-08-20', '11987654340', 14),
('HEITOR SANTOS MORAES', '32345678901', 'M', '2015-09-21', '11987654341', 9),
('ANTÔNIO FRANCISCHETI GABRIEL MOTA', '43456789012', 'M', '2015-10-22', '11987654342', 11),
('LORENZO MACHADO GARCIA', '54567890123', 'M', '2015-11-23', '11987654343', 9),
('GUSTAVO YOSIOKA RIBEIRO', '65678901234', 'M', '2015-12-24', '11987654344', 9),
('BENJAMIN BASSETI APOLINARIO', '76789012345', 'M', '2015-01-25', '11987654345', 21),
('João Marcos Paizan Neto', '87890123456', 'M', '2015-02-26', '11987654346', 12),
('LUIZ MAZIEIRO DOS SANTOS PELICIA', '98901234567', 'M', '2015-03-27', '11987654347', 11),
('JOÃO LORENZO CAMPOS RODRIGUES', '10234567890', 'M', '2015-04-28', '11987654348', 5),
('RAFAEL SHIKASHO BACHIEGA', '21345678901', 'M', '2015-05-29', '11987654349', 11),
('Davi Andrade de Souza', '32456789012', 'M', '2015-06-30', '11987654350', 12),
('MARCOS DO NASCIMENTO MAZARO', '43567890123', 'M', '2015-07-31', '11987654351', 9),
('THEO PAVANI ZIBORDI', '54678901234', 'M', '2015-08-01', '11987654352', 5),
('leandro Sanches dos santos', '65789012345', 'M', '2015-09-02', '11987654353', 17),
('MIGUEL PIRES DE SOUZA', '76890123456', 'M', '2015-10-03', '11987654354', 5),
('RIO DE REZENDE BARBOSA', '87901234567', 'M', '2015-11-04', '11987654355', 5),
('GABRIEL FACTORE BAZANA', '98012345678', 'M', '2015-12-05', '11987654356', 8),
('Arthur Felipe Tobias', '10901234567', 'M', '2015-01-06', '11987654357', 18),
('LAURO PEROLIZ BORGO PERRI', '21012345678', 'M', '2015-02-07', '11987654358', 15);


-- Inserir permissões
INSERT INTO Permissoes (nome, descricao)
VALUES 
  ('gerenciar_usuarios', 'Permissão para gerenciar usuários'),
  ('gerenciar_noticias', 'Permissão para gerenciar notícias'),
  ('lancar_resultados', 'Permissão para lançar resultados de provas'),
  ('gerar_balizamento', 'Permissão para gerar balizamento das competições');


-- Inserir perfis com suas respectivas permissões
INSERT INTO Perfis (nome, descricao, data_criacao, data_atualizacao)
VALUES 
  ('admin', 'Perfil administrativo', NOW(), NOW()),
  ('noticias', 'Perfil para gestão de notícias', NOW(), NOW()),
  ('gestor', 'Perfil de gestão geral', NOW(), NOW()),
  ('treinador', 'Perfil de treinador', NOW(), NOW());


INSERT INTO provas (nome, Eventos_id, TipoProvas_id, Categorias_id) VALUES
    ('50m livres Pré-Mirim Masculino 2023', 15, 2, 1);

INSERT INTO provas (nome, Eventos_id, TipoProvas_id, Categorias_id) VALUES
    ('50m livres Mirim I Masculino 2023', 15, 2, 2);
	
	
	-- Para nadadores nascidos em 2015 (provas_id = 3)
INSERT INTO records (tempo, nadadores_id, provas_id)
SELECT SEC_TO_TIME(FLOOR(RAND() * (80 - 40 + 1) + 40)), n.id, 3
FROM nadadores n
WHERE YEAR(n.data_nascimento) = 2015;

-- Para nadadores nascidos em 2014 (provas_id = 4)
INSERT INTO records (tempo, nadadores_id, provas_id)
SELECT SEC_TO_TIME(FLOOR(RAND() * (80 - 40 + 1) + 40)), n.id, 4
FROM nadadores n
WHERE YEAR(n.data_nascimento) = 2014;

	
	-- Inscrição dos nadadores nascidos em 2015 na prova de ID 1
INSERT INTO Inscricoes (Nadadores_id, Provas_id, Eventos_id)
SELECT id, 1, 16
FROM Nadadores
WHERE YEAR(data_nascimento) = 2015;

-- Inscrição dos nadadores nascidos em 2014 na prova de ID 2
INSERT INTO Inscricoes (Nadadores_id, Provas_id, Eventos_id)
SELECT id, 2, 16
FROM Nadadores
WHERE YEAR(data_nascimento) = 2014;
