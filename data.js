/* ===============================
   AI QUESTION GENERATOR
=============================== */

async function generateAIQuestions() {

    const chapter =
        document.getElementById(
            "chapterSelector"
        ).value;

    const count =
        parseInt(
            document.getElementById(
                "questionCount"
            ).value
        );

    /* ===============================
       PUT YOUR GEMINI API KEY HERE
    =============================== */

    const apiKey =
        "AIzaSyBcBKVPDrNoKbPKHEG3aAzS7dv7nBlF5gY";

    /* =============================== */

    const prompt = `
Generate ${count} NEET Biology MCQs
from chapter "${chapter}".

Return ONLY valid JSON array.

Format:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Correct option"
  }
]
`;

    try {

        const response =
            await fetch(

                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,

                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        contents: [

                            {
                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

        const data =
            await response.json();

        console.log(data);

        const rawText =
            data.candidates[0]
            .content.parts[0].text;

        const cleanedText =
            rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const aiQuestions =
            JSON.parse(cleanedText);

        renderAIQuestions(aiQuestions);

    }

    catch(error) {

        console.error(error);

        alert(
            "AI generation failed"
        );
    }
}

/* ===============================
   RENDER QUESTIONS
=============================== */

function renderAIQuestions(questionList) {

    const qViewport =
        document.getElementById(
            "questions-viewport"
        );

    const aViewport =
        document.getElementById(
            "answers-viewport"
        );

    qViewport.innerHTML = "";

    aViewport.innerHTML = "";

    questionList.forEach((q, index) => {

        qViewport.innerHTML += `

            <div class="q-card">

                <div class="q-meta">

                    AI Question
                    ${index + 1}

                </div>

                <div class="q-text">

                    ${q.question}

                </div>

                <div class="options-grid">

                    ${q.options.map(option => `

                        <div
                            class="option-item"

                            onclick="
                                checkAnswer(
                                    this,
                                    '${option}',
                                    '${q.answer}'
                                )
                            "
                        >

                            ${option}

                        </div>

                    `).join("")}

                </div>

            </div>
        `;

        aViewport.innerHTML += `

            <div class="ans-pill">

                Q${index + 1}:
                ${q.answer}

            </div>
        `;
    });
}

/* ===============================
   CHECK ANSWER
=============================== */

function checkAnswer(
    element,
    selected,
    correct
) {

    const parent =
        element.parentElement;

    const allOptions =
        parent.querySelectorAll(
            ".option-item"
        );

    allOptions.forEach(opt => {

        opt.style.pointerEvents =
            "none";

        if (
            opt.innerText.includes(correct)
        ) {

            opt.style.background =
                "#c8e6c9";

            opt.style.border =
                "2px solid green";
        }
    });

    if (
        selected === correct
    ) {

        element.style.background =
            "#a5d6a7";

        element.innerHTML +=
            " ✅ Correct";

    }

    else {

        element.style.background =
            "#ffcdd2";

        element.innerHTML +=
            " ❌ Wrong";
    }
}

/* ===============================
   TOGGLE ANSWERS
=============================== */

function toggleAnswers() {

    const box =
        document.getElementById(
            "answerSheetBox"
        );

    if (
        box.style.display ===
        "block"
    ) {

        box.style.display =
            "none";
    }

    else {

        box.style.display =
            "block";

        box.scrollIntoView({
            behavior: "smooth"
        });
    }
}
