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

