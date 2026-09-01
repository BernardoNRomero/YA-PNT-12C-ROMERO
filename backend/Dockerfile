# --- Etapa de build: compila el jar con Maven ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Se copian primero los descriptores de dependencias para aprovechar la cache de capas de Docker.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Etapa final: imagen liviana solo con el JRE y el jar generado ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/backend.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
