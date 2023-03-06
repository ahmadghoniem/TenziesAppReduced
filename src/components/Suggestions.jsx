import { useRef } from "react";
import axios from "axios";
import Footer from "./Footer";

export default function Suggestions({ userName, dispatch }) {
  const pantryID = "319f2108-7202-4669-9979-bfbd309ebdd7";
  const pantryBasketName = "Feedbacks";
  const textareaRef = useRef();

  // const [gaveFeedback, setGaveFeedback] = useState(() =>
  //   localStorage.getItem("TenziesFeedback")
  //     ? localStorage.getItem("TenziesFeedback")
  //     : false
  // );

  function setterFunc(e) {
    e.preventDefault();
    let username = e.currentTarget.userName.value;
    console.log(username);
    username = username !== "" ? username : "Guest";
    dispatch({
      type: "update_state",
      payload: { propName: "userName", value: username },
    });
    localStorage.setItem("tenziesName", username);
  }
  function sendSuggestion(e) {
    e.preventDefault();
    let val = textareaRef.current.value;
    if (val === "") return;

    let randId = crypto.randomUUID();
    const config = {
      method: "put",
      url: `https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/${pantryBasketName}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        [randId]: val,
      }),
    };

    axios(config).then(function (response) {
      //console.log(JSON.stringify(response.data));
    });

    textareaRef.current.value = "";
    textareaRef.current.placeholder = "Thankyou for your feedback❤️!";
  }

  const FirstTime = () => {
    return (
      <>
        <h1>
          Hello there👋 <br />
          <span>what's your name?</span>
        </h1>
        <form onSubmit={setterFunc}>
          <input
            type="text"
            defaultValue={userName}
            name="userName"
            maxLength="15"
            placeholder="pick something unique!"
            style={{ marginRight: "5px", borderRadius: "5px" }}
          />
          <button> save </button>
        </form>
      </>
    );
  };
  const WelcomeBack = () => {
    return (
      <>
        <h1 style={{ marginBottom: 0 }}>
          Welcome
          <br /> {userName} 👋!
        </h1>
      </>
    );
  };
  return (
    <div className="Suggestions-board">
      {userName === "Guest" ? <FirstTime /> : <WelcomeBack />}

      <h3 style={{ fontSize: "1.45rem", textAlign: "left", marginTop: "15px" }}>
        send an annonymous Feedback!📩{" "}
      </h3>
      <form onSubmit={sendSuggestion}>
        <textarea ref={textareaRef} className="suggestion-textarea" />
        <button className="send-suggestion">send</button>
      </form>
      <Footer />
    </div>
  );
}
