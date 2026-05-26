# Capa 1: Compilación (Multi-stage build para no pesar en producción)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY openapi.json .
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Capa 2: Entorno de ejecución ligero
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]