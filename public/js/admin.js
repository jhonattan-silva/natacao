import {  gerenciarCPF } from './functions.js';

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM completamente carregado e analisado');
    listaUsuarios();
    carregarPerfis();
    carregarEquipes();
    // Aplica a máscara e validação de CPF ao carregar a página
    const isCPFValido = gerenciarCPF();
  
    const btnCadUsuario = document.getElementById('btnCadUsuario');
    const frmCadUsuario = document.getElementById('frmCadUsuario');

    let editando = false; // Flag para modo de edição
    let usuarioEditado = null; // ID do usuário em edição
  
    btnCadUsuario.addEventListener('click', function() { 
      console.log('Botão Adicionar Novo Usuário clicado');
      frmCadUsuario.style.display = 'block';//exibe o formulário
      frmCadUsuario.reset();
      editando = false;
      usuarioEditado = null;
    });
  
  frmCadUsuario.addEventListener('submit', function(event) {
    console.log('Formulário de cadastro submetido');
      event.preventDefault();
      if (isCPFValido()) {
        if (editando) {
          console.log('Atualizando usuário:', usuarioEditado);
          atualizarUsuario(usuarioEditado);
      } else {
        console.log('Cadastrando novo usuário');
          cadastrarUsuario();
      }
  } else {
      alert('CPF inválido. Por favor, verifique e tente novamente.');
  }
});

  /*#####################################################################*/
      // NOVO CÓDIGO PARA GERENCIAR A EXIBIÇÃO DAS SEÇÕES
      const tileSection = document.getElementById('tileSection');
      const userSection = document.getElementById('user-section');
      const linkUsuarios = document.getElementById('linkUsuarios');
      const linkPermissoes = document.getElementById('linkPermissoes');
      const linkAlterarSenha = document.getElementById('linkAlterarSenha');
  
      // Função para esconder todas as seções
      function hideAllSections() {
          tileSection.style.display = 'none';
          userSection.style.display = 'none';
      }
         
      // Função para remover a classe 'active' de todos os links
    function removeActiveClass() {
      linkUsuarios.classList.remove('active');
      linkUsuarios.removeAttribute('aria-current');
      linkPermissoes.classList.remove('active');
      linkPermissoes.removeAttribute('aria-current');
      linkAlterarSenha.classList.remove('active');
      linkAlterarSenha.removeAttribute('aria-current');
  }
  
      // Exibir os tiles na inicial
      hideAllSections();
      tileSection.style.display = 'block';
  
      // Exibir a seção de usuários quando clicar em 'Usuários'
      linkUsuarios.addEventListener('click', function() {
        console.log('Link Usuários clicado');
        hideAllSections();
        userSection.style.display = 'block';
        removeActiveClass();
        linkUsuarios.classList.add('active');
        linkUsuarios.setAttribute('aria-current', 'page');
    });
  
      // Adicione event listeners para os outros links da sidebar
      linkPermissoes.addEventListener('click', function() {
        hideAllSections();
        // ADICIONE A LÓGICA PARA EXIBIR A SEÇÃO DE PERMISSÕES
        removeActiveClass();
        linkPermissoes.classList.add('active');
        linkPermissoes.setAttribute('aria-current', 'page');
    });
  
      linkAlterarSenha.addEventListener('click', function() {
        hideAllSections();
        // ADICIONE A LÓGICA PARA EXIBIR A SEÇÃO DE ALTERAR SENHA
        removeActiveClass();
        linkAlterarSenha.classList.add('active');
        linkAlterarSenha.setAttribute('aria-current', 'page');
    });
  });


  /*####################################################################*/
  function listaUsuarios() {
    console.log('Listando usuários...');
    fetch('/admin/buscaUsuarios')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar usuários');
        }
        return response.json();
      })
      .then(data => {
        const tabela = document.getElementById('user-table-body');
        tabela.innerHTML = '';
        data.forEach(usuario => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.cpf}</td>
            <td>${usuario.fone}</td>
            <td>${usuario.email}</td>
            <td>${usuario.perfis}</td>
            <td>${usuario.equipes}</td>
            <td>
              <button class="btn btn-primary btn-sm edita-btn" data-id="${usuario.id}">Editar</button>
              <button class="btn btn-danger btn-sm inativa-btn" data-id="${usuario.id}">Inativar</button>
            </td>
          `;
          tabela.appendChild(row);
        });

        // ADICIONA EVENT LISTENERS PARA OS BOTÕES DE EDITAR E INATIVAR
        document.querySelectorAll('.edita-btn').forEach(button => {
          button.addEventListener('click', editarUser);
      });

      document.querySelectorAll('.inativa-btn').forEach(button => {
          button.addEventListener('click', inativarUser);
      });

      })
      .catch(error => {
        console.error('Erro ao carregar usuários:', error);
      });
  }


    /*####################################################################*/
    function editarUser(event) {
      const userId = event.target.getAttribute('data-id');
      console.log('Editando usuário com ID:', userId);
      usuarioEditado = userId; // Define o usuário sendo editado
      editando = true; // Flag de editar/cadastrar
  
      fetch(`/admin/buscarUsuario/${userId}`)
          .then(response => response.json())
          .then(usuario => {
            console.log('Dados do usuário carregado:', usuario);
              const frmCadUsuario = document.getElementById('frmCadUsuario');
              frmCadUsuario.nome.value = usuario.nome;
              frmCadUsuario.cpf.value = usuario.cpf;
              frmCadUsuario.fone.value = usuario.fone;
              frmCadUsuario.email.value = usuario.email;
              frmCadUsuario.senha.value = ''; // Limpa o campo da senha para edição
              frmCadUsuario['equipes-select'].value = usuario.equipeId;
  
              document.querySelectorAll('input[name="perfis"]').forEach(checkbox => {
                  checkbox.checked = usuario.perfis.includes(checkbox.value);
              });
  
              frmCadUsuario.style.display = 'block';
          })
          .catch(error => {
              console.error('Erro ao carregar usuário:', error);
          });
  }


function inativarUser(event) {
  const userId = event.target.getAttribute('data-id');
  const confirmaInativa = confirm(`Tem certeza que deseja inativar o usuário com ID: ${userId}?`);
  if (confirmaInativa) {
      // ENVIE UMA SOLICITAÇÃO PARA INATIVAR O USUÁRIO
      fetch(`/admin/inativarUsuario/${userId}`, {
          method: 'POST'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao inativar usuário');
          }
          return response.text();
      })
      .then(message => {
          alert(message);
          listaUsuarios(); // ATUALIZA A LISTA DE USUÁRIOS APÓS A INATIVAÇÃO
      })
      .catch(error => {
          console.error('Erro ao inativar usuário:', error);
      });
  }
}


      /*####################################################################*/

  function carregarPerfis() {
    fetch('/admin/buscarPerfis')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar perfis');
        }
        return response.json();
      })
      .then(perfis => {
        const perfisContainer = document.getElementById('perfis-container');
        perfis.forEach(perfil => {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.name = 'perfis';
          checkbox.value = perfil.id;
          checkbox.id = `perfil-${perfil.id}`;
  
          const label = document.createElement('label');
          label.htmlFor = `perfil-${perfil.id}`;
          label.textContent = perfil.nome;
  
          const div = document.createElement('div');
          div.appendChild(checkbox);
          div.appendChild(label);
  
          perfisContainer.appendChild(div);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar perfis:', error);
      });
  }
  
  function carregarEquipes() {
    fetch('/admin/buscarEquipes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar equipes');
            }
            return response.json();
        })
        .then(equipes => {
            const equipesSelect = document.getElementById('equipes-select');
            equipes.forEach(equipe => {
                const option = document.createElement('option');
                option.value = equipe.id;
                option.textContent = equipe.nome;
                equipesSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar equipes:', error);
        });
}


  async function cadastrarUsuario() {
    const formData = new FormData(document.getElementById('frmCadUsuario'));
    const perfis = [];
    let cpfValido = true;//flag de validação

    document.querySelectorAll('input[name="perfis"]:checked').forEach(checkbox => {
      perfis.push(checkbox.value);
    });

    const cpf = formData.get('cpf').replace(/\D/g, ''); // Remove a formatação do CPF

    if (cpfValido) {
        const usuario = {
            nome: formData.get('nome'),
            cpf: cpf, //recebe cpf somente numeros
            fone: formData.get('fone'),
            email: formData.get('email'),
            senha: formData.get('senha'),
            perfis: perfis,
            equipeId: formData.get('equipeId') 
        };
  
        console.log('Dados para cadastro:', usuario); // lista os dados antes de enviar

        try {
            const response = await fetch('/admin/cadastrarUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
                
            }

            const message = await response.text();
            alert(message);
            document.getElementById('frmCadUsuario').reset(); // limpa o formulário
            listaUsuarios();
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert(error.message); // Exibe a mensagem de erro ao usuário
        }
    } else {
      alert('Corrija o CPF');
    }
}

async function atualizarUsuario(userId) {
  const formData = new FormData(document.getElementById('frmCadUsuario'));
  const perfis = [];

  document.querySelectorAll('input[name="perfis"]:checked').forEach(checkbox => {
      perfis.push(checkbox.value);
  });

  const usuario = {
      nome: formData.get('nome'),
      cpf: formData.get('cpf').replace(/\D/g, ''), // Remove a formatação do CPF
      fone: formData.get('fone'),
      email: formData.get('email'),
      perfis: perfis,
      equipeId: formData.get('equipe') // Corrige o ID aqui
  };

  // Adiciona a senha somente se estiver preenchida
  const senha = formData.get('senha');
  if (senha) {
      usuario.senha = senha;
  }

  try {
      const response = await fetch(`/admin/atualizarUsuario/${userId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(usuario)
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
      }

      const message = await response.text();
      alert(message);
      document.getElementById('frmCadUsuario').reset();
      document.getElementById('frmCadUsuario').style.display = 'none';
      listaUsuarios();
  } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert(error.message);
  }
}