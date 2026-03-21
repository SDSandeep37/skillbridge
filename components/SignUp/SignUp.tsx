"use client";
import { SubmitEvent, useState } from "react";
import "./signup.css";
import { useRouter } from "next/navigation";
const SignUp = () => {
  const router = useRouter();
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("error");

  // handling the user message error or success
  const handleUserMessage = (message: string, messageType: string) => {
    setMessageType(messageType);
    setUserMessage(message);
    setTimeout(() => {
      setUserMessage("");
    }, 3000);
  };

  // handling form submit and calling handleApiCall function
  const signupFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        handleUserMessage(
          "Password and confirm password should be same",
          "error",
        );
        return;
      }
    }
    if (!fullname || !email || !role || !password || !confirmPassword) {
      handleUserMessage("All fields are required", "error");
      return;
    }
    handleUserMessage("Please wait while processing", "success");
    handleApiCall();
  };

  const handleApiCall = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullname,
            email: email,
            role: role,
            password: password,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        handleUserMessage(errorData.error || "Signup failed", "error");
        return;
      }

      const data = await response.json();
      handleUserMessage("Signup successful!", "success");
      console.log("User created:", data);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      handleUserMessage(`Error: ${error.message}`, "error");
      console.log(error);
    }
  };
  return (
    <div className="signup">
      <div className="signup__content">
        <article>Connecting learners, empowering mentors.</article>
        <p>Join us for free</p>
      </div>
      <form onSubmit={signupFormSubmit}>
        <div className="signup__form-field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            className="signup__form-field_input"
            placeholder="Enter your name"
            value={fullname}
            onChange={(event) => setFullname(event.target.value)}
          />
        </div>
        <div className="signup__form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="signup__form-field_input"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="signup__form-field radio__container">
          <strong>Choose Role</strong>
          <label>
            <input
              type="radio"
              name="role"
              value="mentor"
              className="signup__form-field_input"
              checked={role === "mentor"}
              onChange={(event) => setRole(event.target.value)}
            />
            Mentor
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === "student"}
              className="signup__form-field_input"
              onChange={(event) => setRole(event.target.value)}
            />
            Student
          </label>
        </div>
        <div className="signup__form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="signup__form-field_input"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="signup__form-field">
          <label htmlFor="name">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="signup__form-field_input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <div className="signup__user-action">
          <p
            className={`${messageType === "error" ? "error__message" : "sucess__message"}`}
          >
            {userMessage}
          </p>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
