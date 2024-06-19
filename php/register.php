<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Extremadura</title>
    <link rel="icon" href="multimedia/imagenes/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <meta name ="author" content ="Mario Pérez Fernández" />
    <meta name ="description" content ="Página principal del escritorio virtual" />
    <meta name ="keywords" content ="home,escritorio-virtual" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <script async src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBOx_f1NDXGuzVz7QdgEO8pP7KPLcvlsEQ&callback=console.debug&libraries=maps,marker&v=beta"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

</head>
<body>
<header>
    <h1>Extremadura</h1>
    <nav>
        <a href="/index.html" accesskey="H" tabindex="1">Home</a>
        <a href="/gastronomia.html" accesskey="G" tabindex="2">Gastronomía</a>
        <a href="/rutas.html" accesskey="R" tabindex="3">Rutas</a>
        <a href="/meteorologia.html" accesskey="M" tabindex="5">Meteorología</a>
        <a href="/juego.html" accesskey="J" tabindex="6">Juego</a>
        <a href="/php/reservas.php" accesskey="E" tabindex="7">Reservas</a>
    </nav>
</header>
<main>
    <section>
        <h2>Central de Reservas</h2>
        <h3>Registro</h3>
        <form action="register.php" method="post">
            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" id="nombre" required><br>

            <label for="email">Email:</label>
            <input type="email" name="email" id="email" required><br>

            <label for="password">Contraseña:</label>
            <input type="password" name="password" id="password" required><br>

            <input type="submit" value="Registrarse">
            <?php
                include_once 'db.php';
                include_once 'models.php';

                $database = new Database();
                $db = $database->getConnection();

                $usuario = new Usuario($db);

                if ($_SERVER["REQUEST_METHOD"] == "POST") {
                    $usuario->nombre = $_POST['nombre'];
                    $usuario->email = $_POST['email'];
                    $usuario->password = $_POST['password'];

                    if ($usuario->register()) {
                        echo "Usuario registrado correctamente.";
                    } else {
                        echo "No se pudo registrar el usuario.";
                    }
                }
            ?>
        </form>
    </section>
</main>
<footer>
    <a href="https://mariopdev.com" target="_blank">Mi web</a>
    <a href="https://ingenieriainformatica.uniovi.es" target="_blank">Escuela de Ingeniería Informática</a>
</footer>
</body>
</html>
