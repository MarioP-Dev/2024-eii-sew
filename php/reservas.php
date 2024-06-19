<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit;
}

include_once 'db.php';
include_once 'models.php';

$mensaje = "";
$total = 0;

// Inicializar o recuperar la lista de recursos de la sesión
if (!isset($_SESSION['recursos'])) {
    $_SESSION['recursos'] = [];
}

$database = new Database();
$db = $database->getConnection();
$recurso = new Recurso($db);

// Manejo del formulario para agregar recursos
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['agregar'])) {
    $recurso_id = isset($_POST['recurso']) ? $_POST['recurso'] : null;
    $fecha_inicio = isset($_POST['fecha_inicio']) ? $_POST['fecha_inicio'] : null;
    $fecha_fin = isset($_POST['fecha_fin']) ? $_POST['fecha_fin'] : null;
    $cantidad = isset($_POST['cantidad']) ? $_POST['cantidad'] : null;

    if ($recurso_id && $fecha_inicio && $fecha_fin && $cantidad) {
        // Verificar la ocupación antes de agregar el recurso
        if ($recurso->verificarOcupacion($recurso_id, $fecha_inicio, $fecha_fin, $cantidad)) {
            // Intentar obtener los detalles del recurso
            $stmt = $recurso->readOne($recurso_id);
            if ($stmt) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $row['fecha_inicio'] = $fecha_inicio;
                    $row['fecha_fin'] = $fecha_fin;
                    $row['cantidad'] = $cantidad;

                    // Generar una clave única para el recurso seleccionado
                    $clave = md5(serialize([$recurso_id, $fecha_inicio, $fecha_fin]));

                    // Añadir el recurso al arreglo de recursos en la sesión, usando la clave única
                    $_SESSION['recursos'][$clave] = $row;
                } else {
                    $mensaje = "No se encontraron datos para el recurso solicitado.";
                }
            } else {
                $mensaje = "Error al ejecutar la consulta para obtener el recurso.";
            }
        } else {
            $mensaje = "Límite de ocupación excedido para las fechas seleccionadas.";
        }
    } else {
        $mensaje = "Por favor, completa todos los campos.";
    }
}

// Manejo del formulario para confirmar la reserva
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['confirmar'])) {
    // Crear la reserva en la base de datos
    $reserva = new Reserva($db);
    $detalleReserva = new DetalleReserva($db);
    $reserva->usuario_id = $_SESSION['usuario_id'];

    if ($reserva->create()) {
        $reserva_id = $db->lastInsertId();

        // Guardar los detalles de cada recurso reservado
        foreach ($_SESSION['recursos'] as $clave => $recurso) {
            $detalleReserva->reserva_id = $reserva_id;
            $detalleReserva->recurso_id = $recurso['id'];
            $detalleReserva->fecha_inicio = $recurso['fecha_inicio'];
            $detalleReserva->fecha_fin = $recurso['fecha_fin'];
            $detalleReserva->cantidad = $recurso['cantidad'];
            $detalleReserva->create();

            // Calculando el total de la reserva
            $total += $recurso['precio'] * $recurso['cantidad'];
        }

        // Limpiar la lista de recursos de la sesión después de confirmar la reserva
        $_SESSION['recursos'] = [];
        $mensaje = "Reserva realizada correctamente.";
    } else {
        $mensaje = "No se pudo crear la reserva.";
    }
}
?>
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
        <h2>Central de reservas</h2>
        <p>Bienvenido <?php echo $_SESSION['nombre'] ?>!</p>
        <a href="logout.php">Cerrar Sesión</a>
    </section>

    <section>
        <h2>Realizar Reserva</h2>
        <form action="#" method="post">
            <label for="recurso">Recurso:</label>
            <select name="recurso" id="recurso">
                <?php
                $recurso = new Recurso($db);
                $stmt = $recurso->read();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    echo "<option value='{$id}'>{$nombre}</option>";
                }
                ?>
            </select><br>

            <label for="fecha_inicio">Fecha de Inicio:</label>
            <input type="datetime-local" name="fecha_inicio" id="fecha_inicio"><br>

            <label for="fecha_fin">Fecha de Fin:</label>
            <input type="datetime-local" name="fecha_fin" id="fecha_fin"><br>

            <label for="cantidad">Cantidad:</label>
            <input type="number" name="cantidad" id="cantidad"><br>

            <input type="submit" name="agregar" value="Agregar Recurso">
            
            <?php
            // Mostrar mensaje de error o éxito
            if (!empty($mensaje)) {
                echo "<p>{$mensaje}</p>";
            }

            // Mostrar los recursos seleccionados
            if (!empty($_SESSION['recursos'])) {
                echo "<h3>Presupuesto no confirmado</h3>";
                echo "<ul>";
                foreach ($_SESSION['recursos'] as $clave => $recurso) {
                    echo "<li>";
                    echo "<p><strong>Nombre:</strong> {$recurso['nombre']}</p>";
                    echo "<p><strong>Fecha Inicio:</strong> {$recurso['fecha_inicio']}</p>";
                    echo "<p><strong>Fecha Fin:</strong> {$recurso['fecha_fin']}</p>";
                    echo "<p><strong>Cantidad:</strong> {$recurso['cantidad']}</p>";
                    echo "</li>";
                    $total += $recurso['precio'] * $recurso['cantidad'];
                }
                echo "</ul>";
                echo "<p><strong>Total:</strong> {$total}€</p>";
            }
            ?>
            <input type="submit" name="confirmar" value="Confirmar Reserva">
        </form>
    </section>
<section>
        
        <h3>Recursos Turísticos Disponibles</h3>
        <ul>
            <?php
            $recurso = new Recurso($db);
            $stmt = $recurso->read();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                echo "<li>";
                echo "<article>";
                echo "<h3>{$nombre}</h3>";
                echo "<p>{$descripcion}</p>";
                echo "<p><strong>Precio:</strong> {$precio}€</p>";
                echo "<p><strong>Ocupación máxima:</strong> {$limite_ocupacion}</p>";
                echo "</article>";
                echo "</li>";
            }
            ?>
        </ul>
    </section>
</main>
<footer>
    <a href="https://mariopdev.com" target="_blank">Mi web</a>
    <a href="https://ingenieriainformatica.uniovi.es" target="_blank">Escuela de Ingeniería Informática</a>
</footer>
</body>
</html>
