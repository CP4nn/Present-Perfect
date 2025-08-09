//Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDm2jou4yQVJIPklZp8HIgKfmM38kF_ubI",
    authDomain: "present-perfect-5ffef.firebaseapp.com",
    databaseURL: "https://present-perfect-5ffef-default-rtdb.firebaseio.com",
    projectId: "present-perfect-5ffef",
    storageBucket: "present-perfect-5ffef.firebasestorage.app",
    messagingSenderId: "787083497991",
    appId: "1:787083497991:web:3f2353a88fa01bc0e2d0a2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function guardarPuntaje(nombre, puntos) {
    const referencia = db.ref("puntajes").push();
    referencia.set({ nombre, puntos });
}

const questions = [
    {
    question: "She ___ (to visit) Paris three times.",
    options: ["has visited", "visited", "have visited", "is visiting"],
    answer: "has visited"
    },
    {
    question: "I ___ (to finish) my homework already.",
    options: ["finished", "have finished", "has finished", "am finishing"],
    answer: "have finished"
    },
    {
    question: "She ______ (finish) her homework.",
    options: ["has finished", "have finished", "finished", "finishes"],
    answer: "has finished"
    },
    {
    question: "I ______ (never / be) to Japan.",
    options: ["have never been", "never have been", "have been never", "never been"],
    answer: "have never been"
    },
    {
    question: "They ______ (just / arrive) at the airport.",
    options: ["have just arrived", "just have arrived", "have arrived just", "arrived just"],
    answer: "have just arrived"
    },
    {
    question: "We ______ (live) here since 2010.",
    options: ["lived", "has lived", "have lived", "live"],
    answer: "have lived"
    },
    {
    question: "He ______ (already / eat) lunch.",
    options: ["has already eaten", "already has eaten", "has eaten already", "eaten already"],
    answer: "has already eaten"
    },
    {
    question: "You ______ (ever / see) that movie?",
    options: ["have ever seen", "ever have seen", "have seen ever", "seen ever"],
    answer: "have ever seen"
    },
    {
    question: "I ______ (not / finish) the report yet.",
    options: ["have not finished", "has not finished", "haven't finish", "didn't finish"],
    answer: "have not finished"
    },
    {
    question: "She ______ (break) her phone.",
    options: ["broke", "have broken", "has broken", "break"],
    answer: "has broken"
    },
    {
    question: "We ______ (know) each other for years.",
    options: ["have known", "has known", "knew", "know"],
    answer: "have known"
    },
    {
    question: "They ______ (not / visit) us recently.",
    options: ["have not visited", "has not visited", "haven't visit", "didn't visit"],
    answer: "have not visited"
    },
    {
    question: "They ___ (to see) that movie before.",
    options: ["have seen", "saw", "has seen", "see"],
    answer: "have seen"
    }
];

let currentQuestion = 0;
let score = 0;

const container = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");

function showQuestion() {
    container.innerHTML = "";
    nextBtn.style.display = "none";

    const q = questions[currentQuestion];
    const questionEl = document.createElement("h3");
    questionEl.textContent = q.question;
    container.appendChild(questionEl);

    q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    btn.onclick = () => handleAnswer(option);
    container.appendChild(btn);
    });
}

function handleAnswer(selected) {
    const correct = questions[currentQuestion].answer;
    if (selected === correct) score++;

    Array.from(container.querySelectorAll("button")).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) {
        btn.style.backgroundColor = "#c8f7c5";
    } else if (btn.textContent === selected) {
        btn.style.backgroundColor = "#f7c5c5";
    }
    });

    nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
    showQuestion();
    } else {
    showFinalScore();
    }
};

function showFinalScore() {
    container.innerHTML = `
    <h3>✅ Game Completed</h3>
    <p>Your Score: <strong>${score}</strong> de ${questions.length}</p>
    <input type="text" id="playerName" placeholder="Your name" />
    <button onclick="guardarYActualizarDesdeJuego()">Save Score</button>
    `;
    nextBtn.style.display = "none";
}

function guardarPuntaje(nombre, puntos) {
    db.ref("puntajes").orderByChild("nombre").equalTo(nombre).once("value", snapshot => {
        if (snapshot.exists()) {
            let actualizado = false;
            snapshot.forEach(child => {
                const data = child.val();
                if (puntos > data.puntos) {
                    db.ref("puntajes").child(child.key).update( {puntos });
                    alert("Score Actualized");
                    actualizado = true;
                }
            });
            if (!actualizado) {
                alert("Name already registered");
            }
        } else {
            db.ref("puntajes").push( { nombre, puntos });
            alert("Score registered");
        }
    });
}

function guardarYActualizarDesdeJuego() {
    const nombre = document.getElementById("playerName").value.trim();
    if (nombre) {
    guardarPuntaje(nombre, score);
    score = 0;
    currentQuestion = 0;
    showQuestion();
    }
};

showQuestion();

// Clasificacion en tiempo real


function actualizarClasificacion() {
    const leaderboard = document.getElementById("leaderboard");
    db.ref("puntajes").on("value", snapshot => {
        const datos = [];
        snapshot.forEach(child => {
            datos.push(child.val());
        });

        //Ordenar puntuacion
        datos.sort((a, b) => b.puntos - a.puntos);

        //Mostrar los primers 5
        leaderboard.innerHTML = `
            <h3></h3>
            <ul style="list-style:none; padding:0;">
                ${datos.slice(0, 40).map(d => `
                    <li style="margin:0.5rem 0; padding:0.5rem; background:#e0f0ff; border-radius:6px;">
                        <strong>${d.nombre}</strong>: ${d.puntos} pts
                    </li>
                `).join("")}
            </ul>
        `;
    });
}

actualizarClasificacion();
