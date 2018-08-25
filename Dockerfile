FROM microsoft/dotnet:2.1-sdk AS builder
WORKDIR /app

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs

COPY . .
RUN dotnet restore

RUN dotnet publish -o out -c Release

FROM microsoft/dotnet:2.1-aspnetcore-runtime
WORKDIR /app
COPY --from=builder /app/database ./database
COPY --from=builder /app/out .
COPY --from=builder /app/AngularClient/dist .
EXPOSE 80

# ENTRYPOINT ["dotnet", "QaNet.dll"]
CMD ASPNETCORE_URLS=http://*:$PORT dotnet QaNet.dll

# dklist
#  dkl='docker image ls'
#  dkp='docker image prune'
#  dkb-qanet='docker build -t qanet .'
#  dkth='docker tag qanet registry.heroku.com/qanet/web'
#  dkph='docker push registry.heroku.com/qanet/web'
#  dkrm='docker rmi -f'
#  hc='heroku create qanet'
#  hcl='heroku container:login'
#  dkphc='heroku container:push web --app qanet'
#  dkhr='heroku container:release web --app qanet'
#  dkho='heroku open --app qanet