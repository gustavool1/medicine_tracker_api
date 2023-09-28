# Medicine Tracker 
[![NPM](https://img.shields.io/npm/l/react)]([https://github.com/devsuperior/sds1-wmazoni/blob/master/LICENSE](https://github.com/gustavool1/medicine_tracker/blob/main/LICENSE)) 

# Sobre o projeto

Medicine tracker é um projeto criado para ajudar os usuários a manterem controle dos remédios que precisam ingerir no seu dia-a-dia através de alarmes

# Diagrama entidadade relacionamento
![Diagrama](https://github.com/gustavool1/medicine_tracker_api/blob/main/src/assets/er-diagram.png)

# Tecnologias utilizadas

## Back end
- Node
- Nest
- TypeScript
- Jest
- TypeORM
- Jwt

# Como executar o projeto

## Back end

```bash
# clonar repositório
git clone https://github.com/gustavool1/medicine_tracker_api backend

# Entrar na pasta do projeto back end
cd backend
Preencher .env, tome como base o .env.example

# Instalar dependências do projeto
yarn

# Criar a imagem docker do app
sudo docker build -t medicine-tracker .

# Rode o compose
sudo docker-compose up

Pronto, agora o back já está pronto para receber uma request!

```


# Autor

Gustavo Oliveira

https://www.linkedin.com/in/gustavo-oliveira01011/
