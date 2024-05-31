import { formatarCPF, validarCPF, formatarTelefone, validarTelefone } from './functions';

document.addEventListener('DOMContentLoaded', function() {
    listaUsuarios();
    carregarPerfis();
  
    const btnCadUsuario = document.getElementById('btnCadUsuario');
    const frmCadUsuario = document.getElementById('frmCadUsuario');
  
    btnCadUsuario.addEventListener('click', function() {
      frmCadUsuario.style.display = 'block';
    });
  
    frmCadUsuario.addEventListener('submit', function(event) {
      event.preventDefault();
      cadastrarUsuario();
    });
  });
  
  function listaUsuarios() {
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
          `;
          tabela.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar usuários:', error);
      });
  }

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
  
  function cadastrarUsuario() {
    const formData = new FormData(document.getElementById('frmCadUsuario'));
    const perfis = [];
    document.querySelectorAll('input[name="perfis"]:checked').forEach(checkbox => {
      perfis.push(checkbox.value);
    });

    const data = {
      nome: formData.get('nome'),
      cpf: formData.get('cpf'),
      fone: formData.get('fone'),
      email: formData.get('email'),
      senha: formData.get('senha'),
      perfis: perfis
    };
  
    console.log('Dados para cadastro:', data); // Verifique os dados antes de enviar

    fetch('/admin/cadastrarUsuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao cadastrar usuário');
        }
        return response.text();
      })
      .then(message => {
        alert(message);
        document.getElementById('frmCadUsuario').reset(); // Reseta o formulário
        listaUsuarios();
      })
      .catch(error => {
        console.error('Erro ao cadastrar usuário:', error);
      });
  }
  