CREATE DATABASE CentralReservas;

USE CentralReservas;

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TiposRecursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Recursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    limite_ocupacion INT NOT NULL,
    tipo_id INT,
    FOREIGN KEY (tipo_id) REFERENCES TiposRecursos(id)
);

CREATE TABLE Reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

CREATE TABLE DetallesReservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT,
    recurso_id INT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    cantidad INT,
    FOREIGN KEY (reserva_id) REFERENCES Reservas(id),
    FOREIGN KEY (recurso_id) REFERENCES Recursos(id)
);

INSERT INTO TiposRecursos (nombre) VALUES ('Museo'), ('Ruta'), ('Restaurante'), ('Hotel'), ('Parque Natural'), ('Centro Histórico'), ('Teatro'), ('Cine'), ('Biblioteca'), ('Parque Temático');

INSERT INTO Recursos (nombre, descripcion, precio, limite_ocupacion, tipo_id) VALUES 
('Museo Nacional de Arte Romano', 'Museo en Mérida con una impresionante colección de arte y objetos romanos.', 8.50, 100, 1),
('Ruta con guía de los Conquistadores', 'Ruta turística que recorre los lugares más emblemáticos relacionados con los conquistadores españoles.', 2.99, 30, 2),
('Restaurante Atrio', 'Restaurante en Cáceres con dos estrellas Michelin, famoso por su cocina innovadora.', 150.00, 20, 3),
('Parador de Plasencia', 'Hotel histórico en un antiguo convento dominico del siglo XV en Plasencia.', 120.00, 50, 4),
('Parque Natural de Monfragüe', 'Parque natural conocido por su biodiversidad y miradores de aves.', 5.00, 200, 5),
('Ruta guiada por el centro Histórico de Cáceres', 'Conjunto monumental con arquitectura de diferentes épocas, declarado Patrimonio de la Humanidad.', 5.00, 150, 6),
('Teatro Romano de Mérida', 'Antiguo teatro romano bien conservado que aún se utiliza para eventos y festivales.', 12.00, 100, 7),
('Cine Victoria', 'Cine histórico en Badajoz con una gran variedad de películas internacionales.', 7.00, 100, 8),
('Acceso a Biblioteca de Extremadura', 'Biblioteca regional situada en Badajoz, con una vasta colección de libros y documentos.', 1.00, 50, 9),
('Parque Temático Naturaleza de Extremadura', 'Parque temático que ofrece actividades educativas y de entretenimiento relacionadas con la naturaleza de la región.', 25.00, 300, 10);