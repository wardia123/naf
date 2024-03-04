<?php
header('Content-Type: application/json');

// Récupérer les données POST
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier si les données ont été correctement envoyées
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['error' => 'Veuillez fournir un nom d\'utilisateur et un mot de passe']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// Connexion à la base de données
$servername = "localhost";
$dbname = "mybase";
$usernameDB = "root";
$passwordDB = "";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $usernameDB, $passwordDB);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Vérifier si l'utilisateur existe dans la base de données
    $stmt = $conn->prepare("SELECT * FROM tableuser WHERE username = :username AND password = :password");
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $password);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Générer un token (ici, un simple token aléatoire)
        $token = bin2hex(random_bytes(16));

        // Stocker le token dans la base de données (à adapter selon votre structure de base de données)
        $stmt = $conn->prepare("UPDATE tableuser SET token = :token WHERE id = :id");
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':id', $user['id']);
        $stmt->execute();

        echo json_encode(['token' => $token]);
    } else {
        echo json_encode(['error' => 'Nom d\'utilisateur ou mot de passe incorrect']);
    }
} catch(PDOException $e) {
    echo json_encode(['error' => 'Erreur de connexion à la base de données: ' . $e->getMessage()]);
}
?>
