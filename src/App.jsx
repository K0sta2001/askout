import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

// Getform URL (replace with your own Getform form endpoint)
const getformURL = "https://getform.io/f/adrnndxa"; // Replace with your Getform URL

// Function to handle sending the answer to Getform
const handleAnswer = (answer, setUserAnswer) => {
  localStorage.setItem("userAnswer", answer);
  setUserAnswer(answer);

  // Send answer to Getform
  fetch(getformURL, {
    method: "POST",  // Sends data via POST request
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answer: answer }), // The data you want to send
  })
    .then(() => {
      console.log("Answer submitted!");
    })
    .catch((error) => {
      console.error("Error submitting answer:", error);
    });
};

const messages = [
  {
    text: "პრივეტ, ვიცი, დიდ ხანს არ გიცნობ, პრინციპში საერთოდ არ გიცნობ.",
    duration: 10000,
  },
  { text: "მაგრამ მინდა გაგიცნო ❤️", duration: 5000 },
  {
    text: "ჯერჯერობით შენგან ეს პასუხები მოვისმინე, რაც ოქეია: ",
    duration: 10000,
  },
  {
    text: "მაგრამ კიდევ მინდა, ვცადო და ის რაც მიმოწერაში მომწონს, დეითზეც მომწონდეს.",
    duration: 10000,
  },
  { text: "ხოდა...", duration: 5000 },
  { text: "Will you go out with me ^^", duration: null },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);

  useEffect(() => {
    const storedAnswer = localStorage.getItem("userAnswer");
    if (storedAnswer) {
      setUserAnswer(storedAnswer);
    }
  }, []);

  useEffect(() => {
    if (!userAnswer && index < messages.length - 1) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, messages[index].duration);
      return () => clearTimeout(timer);
    } else if (!userAnswer) {
      setShowButtons(true);  // Show buttons only when all messages are displayed
    }
  }, [index, userAnswer]);

  return (
    <div className="container">
      {userAnswer ? (
        <motion.img
          src={userAnswer === "yes" ? "/happy.gif" : "/sad.gif"}
          alt={userAnswer === "yes" ? "Happy" : "Sad"}
          className="gif"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              className="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              {messages[index].text}
            </motion.p>
          </AnimatePresence>

          {/* Render the no.gif after the 3rd message (index 2) */}
          {index === 2 && (
            <motion.img
              src="/no.gif"
              alt="No"
              className="gif"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              style={{ marginTop: "20px" }} // Add some spacing
            />
          )}

          {showButtons && (
            <div className="buttons">
              <button className="yes" onClick={() => handleAnswer("yes", setUserAnswer)}>
                Yes
              </button>
              <button className="no" onClick={() => handleAnswer("no", setUserAnswer)}>
                No
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
