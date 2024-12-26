<script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
        import { getFirestore, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
        import { getAuth, onAuthStateChanged, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

        const firebaseConfig = { 
            apiKey: "AIzaSyDLi-egzQlgbKW8XV_qIhU6313Gd8gocCg",
            authDomain: "inventario-35d6b.firebaseapp.com", 
            projectId: "inventario-35d6b", 
            storageBucket: "inventario-35d6b.appspot.com",
            messagingSenderId: "266100399659",
            appId: "1:266100399659:web:92358d28cbd803c8a7d46e"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        // Configurar la persistencia de sesión
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                // Verificar el estado de autenticación
                onAuthStateChanged(auth, (currentUser) => {
                    const userId = currentUser ? currentUser.uid : "predefinedUserId"; // Cambiar a un ID predefinido si no hay sesión
                    checkPermissions(userId); // Verificar permisos
                });
            })
            .catch((error) => {
                console.error("Error al establecer la persistencia: ", error);
            });

        // Función para verificar permisos
        function checkPermissions(userId) {
            const userRef = doc(db, "users", userId);
            
            // Escuchar cambios en tiempo real
            onSnapshot(userRef, (userDoc) => {
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    console.log("Datos del usuario:", data); 
                    
                    // Verificar permisos
                    if (data.admproducto && data.admproducto.includes(userId)) {
                        window.location.href = 'Punto-gestion-de-producto.html'; // Redirigir a gestion-productos.html
                    } else {
                        document.getElementById("restrictedButton").style.display = "none"; // Ocultar el botón
                        showAlert("No tienes permiso para realizar esta acción.");
                    }
                } else { 
                    showAlert("No se encontraron datos para el usuario."); 
                    console.log("No se encontraron datos para el usuario:", userRef); 
                }
            }, (error) => {
                console.error("Error al obtener datos del usuario: ", error); 
                showAlert("Ocurrió un error al verificar permisos.");
            }); 
        }

        function showAlert(message) {
            const alertDiv = document.getElementById("alert");  
            alertDiv.innerText = message;
            alertDiv.style.display = "block"; // Mostrar la alerta
            setTimeout(() => {
                alertDiv.style.display = "none"; // Ocultar después de 5 segundos  
            }, 5000);
        }
    </script> 