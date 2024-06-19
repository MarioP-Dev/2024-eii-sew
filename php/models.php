<?php
class Usuario {
    private $conn;
    private $table_name = "Usuarios";

    public $id;
    public $nombre;
    public $email;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register() {
        $query = "INSERT INTO " . $this->table_name . " SET nombre=:nombre, email=:email, password=:password";
        $stmt = $this->conn->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function login() {
        $query = "SELECT id, nombre, email, password FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            if (password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->nombre = $row['nombre'];
                return true;
            }
        }
        return false;
    }
}

class Recurso {
    private $conn;
    private $table_name = "Recursos";

    public $id;
    public $nombre;
    public $descripcion;
    public $precio;
    public $limite_ocupacion;
    public $tipo_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET nombre=:nombre, descripcion=:descripcion, precio=:precio, limite_ocupacion=:limite_ocupacion, tipo_id=:tipo_id";
        $stmt = $this->conn->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->precio = htmlspecialchars(strip_tags($this->precio));
        $this->limite_ocupacion = htmlspecialchars(strip_tags($this->limite_ocupacion));
        $this->tipo_id = htmlspecialchars(strip_tags($this->tipo_id));

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":precio", $this->precio);
        $stmt->bindParam(":limite_ocupacion", $this->limite_ocupacion);
        $stmt->bindParam(":tipo_id", $this->tipo_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function verificarOcupacion($recurso_id, $fecha_inicio, $fecha_fin, $cantidad) {
        $query = "SELECT SUM(cantidad) as total_ocupacion FROM DetallesReservas 
                  WHERE recurso_id = :recurso_id 
                  AND ((fecha_inicio BETWEEN :fecha_inicio AND :fecha_fin) 
                  OR (fecha_fin BETWEEN :fecha_inicio AND :fecha_fin))";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":recurso_id", $recurso_id);
        $stmt->bindParam(":fecha_inicio", $fecha_inicio);
        $stmt->bindParam(":fecha_fin", $fecha_fin);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_ocupacion = $row['total_ocupacion'] ? $row['total_ocupacion'] : 0;

        return ($total_ocupacion + $cantidad) <= $this->getLimiteOcupacion($recurso_id);
    }

    private function getLimiteOcupacion($recurso_id) {
        $query = "SELECT limite_ocupacion FROM " . $this->table_name . " WHERE id = :recurso_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":recurso_id", $recurso_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['limite_ocupacion'];
    }

    function readOne($recurso_id) {
        $query = "SELECT id, nombre, descripcion, precio, limite_ocupacion FROM recursos WHERE id = :recurso_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":recurso_id", $recurso_id);
        
        if ($stmt->execute()) {
            return $stmt;
        } else {
            // Imprimir el error de la consulta para depuración
            $errorInfo = $stmt->errorInfo();
            echo "Error al ejecutar la consulta SQL: " . $errorInfo[2];
            return null;
        }
    }
}

class Reserva {
    private $conn;
    private $table_name = "Reservas";

    public $id;
    public $usuario_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET usuario_id=:usuario_id";
        $stmt = $this->conn->prepare($query);

        $this->usuario_id = htmlspecialchars(strip_tags($this->usuario_id));

        $stmt->bindParam(":usuario_id", $this->usuario_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByUser($usuario_id) {
        $query = "SELECT * FROM Reservas WHERE usuario_id = :usuario_id ORDER BY fecha_reserva DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":usuario_id", $usuario_id);
        $stmt->execute();
        return $stmt;
    }
}


class DetalleReserva {
    private $conn;
    private $table_name = "DetallesReservas";

    public $id;
    public $reserva_id;
    public $recurso_id;
    public $fecha_inicio;
    public $fecha_fin;
    public $cantidad;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET reserva_id=:reserva_id, recurso_id=:recurso_id, fecha_inicio=:fecha_inicio, fecha_fin=:fecha_fin, cantidad=:cantidad";
        $stmt = $this->conn->prepare($query);

        $this->reserva_id = htmlspecialchars(strip_tags($this->reserva_id));
        $this->recurso_id = htmlspecialchars(strip_tags($this->recurso_id));
        $this->fecha_inicio = htmlspecialchars(strip_tags($this->fecha_inicio));
        $this->fecha_fin = htmlspecialchars(strip_tags($this->fecha_fin));
        $this->cantidad = htmlspecialchars(strip_tags($this->cantidad));

        $stmt->bindParam(":reserva_id", $this->reserva_id);
        $stmt->bindParam(":recurso_id", $this->recurso_id);
        $stmt->bindParam(":fecha_inicio", $this->fecha_inicio);
        $stmt->bindParam(":fecha_fin", $this->fecha_fin);
        $stmt->bindParam(":cantidad", $this->cantidad);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readByReserva($reserva_id) {
        $query = "SELECT * FROM DetallesReservas WHERE reserva_id = :reserva_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":reserva_id", $reserva_id);
        $stmt->execute();
        return $stmt;
    }
}
?>



