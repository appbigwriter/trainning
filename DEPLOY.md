# Deploy no Easypanel

## Endereços

- Hostname: `trainning.fbr.news` (grafia solicitada).
- Portal: `https://trainning.fbr.news/`.
- Curso: `https://trainning.fbr.news/amazon/`.
- Repositório: `https://github.com/appbigwriter/trainning.git`.

`trainning.fbr.news` é um subdomínio de `fbr.news`. Se você administra `fbr.news`, crie o registro na zona DNS desse domínio; `/amazon` é um caminho do site, não um registro DNS.

## Configuração

1. No DNS, crie um registro **A** com nome `trainning` apontando para o IPv4 público da VPS. Configure AAAA somente se a VPS e o proxy realmente atenderem por IPv6.
2. No Easypanel, crie um projeto (exemplo: `fbr-training`) e um serviço do tipo **App** (exemplo: `web`).
3. Em Source → GitHub: repositório `appbigwriter/trainning`, branch `main`, Build Path `/`. Se escolher Source → Git, use a URL completa do repositório.
4. Em Build: builder **Dockerfile**, arquivo `Dockerfile`, na raiz. Nenhum comando npm ou build adicional é necessário.
5. Em Domains: hostname `trainning.fbr.news`, caminho `/`, protocolo interno **HTTP**, porta interna **80**. Preserve o caminho da URL; não aplique remoção de `/amazon`.
6. Ative HTTPS usando o mecanismo de certificados do Easypanel, após o DNS apontar para a VPS. Se houver firewall, mantenha 80/443 disponíveis para o proxy. O proxy Easypanel encaminha HTTP para a porta 80 do container.
7. Clique em Deploy e confira saída de build, logs e estado do serviço.
8. Confira `/`, `/amazon/`, as três páginas de trilha e `/healthz`. `/amazon` deve redirecionar para `/amazon/`.

O domínio inteiro usa o serviço do portal. O Nginx resolve as pastas dos cursos; o caminho do domínio no Easypanel deve permanecer `/`.

## Recursos

- Porta do container: `80`, escuta em todas as interfaces.
- Health check: `GET /healthz` retorna `200` e `ok`.
- Sem banco, variáveis secretas ou volume persistente.
- A imagem Nginx está fixada por digest; atualizar a imagem requer rever o digest no Dockerfile e testar.
- Assets HTML/CSS/JS usam validação de cache para alterações chegarem ao navegador.

## Atualizações e rollback

Faça commit e push para `main`. Com Auto Deploy habilitado, o Easypanel recebe o webhook; sem ele, faça Deploy manual. A workflow `Verify site` valida links e build/rotas do container no GitHub, mas não publica na VPS. Espere a verificação passar antes do deploy manual; Auto Deploy não fica condicionado a essa workflow.

Para rollback, publique um commit revertendo a alteração e faça um novo Deploy. Evite alterar arquivos apenas dentro do container, pois serão substituídos no próximo deploy.

## Verificação local do container

```sh
docker build -t fbr-training .
docker run --rm -p 8080:80 fbr-training
```

Abra `http://localhost:8080/amazon/`. A URL final só estará disponível após configuração DNS, serviço e deploy na VPS.

Referência: [App Service — documentação oficial Easypanel](https://easypanel.io/docs/services/app).
