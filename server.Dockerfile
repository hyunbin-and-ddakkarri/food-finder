FROM rust:1.70

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY server/Cargo.toml server/Cargo.lock ./
RUN mkdir src && echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs && cargo build --release && rm -rf src

COPY server/src ./src
RUN rm ./target/release/deps/server*
RUN cargo build --release

COPY server/.env ./

EXPOSE 8080

CMD ["./target/release/server"]
