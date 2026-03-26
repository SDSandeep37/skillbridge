import Link from "next/link";
import "./detailstable.css";
import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface tableDetailsType {
  data: any;
  tableFor: string;
}
const DetailsTable = ({ data, tableFor }: tableDetailsType) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [userMessage, setUserMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("error");
  const [sessionTopic, setSessionTopic] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();
  // handling the user message error or success
  const handleUserMessage = (message: string, messageType: string) => {
    setMessageType(messageType);
    setUserMessage(message);
    setTimeout(() => {
      setUserMessage("");
    }, 3000);
  };

  // to open the session creation modal
  const openModal = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
  // to close the session creation modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // to handle form submit
  const handleSessionCreation = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionTopic) {
      handleUserMessage("Please enter session topic", "error");
      return;
    }
    handleUserMessage("Please wait while processing", "success");
    handleApiCall();
  };

  // handling api call for session call
  const handleApiCall = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: selectedStudent?.id,
            topic: sessionTopic,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        handleUserMessage(
          errorData.error || "Session creation failed",
          "error",
        );
        return;
      }

      const data = await response.json();
      handleUserMessage("Session created successfully", "success");

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error: any) {
      handleUserMessage(`Error: ${error.message}`, "error");
      console.log(error);
    }
  };

  // Handling session end by mentor
  const handleSessionEnding = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/end-session/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        setTimeout(() => {
          setProcessingId(null);
        }, 1000);
        return;
      }
      const result = await response.json();
      alert(result.message);
      setTimeout(() => {
        setProcessingId(null);
        setButtonText("Ended");
      }, 1000);
    } catch (error) {
      console.error("Error ending session", error);
    }
  };
  const handleSessionJoining = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/join-session/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        setTimeout(() => {
          setProcessingId(null);
        }, 1000);
        return;
      }
      const result = await response.json();
      alert(result.message);
      setTimeout(() => {
        setProcessingId(null);
        setButtonText("Joined");
        router.push(`/dashboard/editor/${id}`);
      }, 1000);
    } catch (error) {
      console.error("Error joining session", error);
    }
  };
  return (
    <div className="tableDiv">
      <table className="min-w-full border border-gray-700 text-sm text-left text-gray-300">
        <thead className="bg-linear-to-r from-gray-800 to-gray-900 text-gray-100">
          {tableFor === "studentsDetails" && (
            <tr>
              <th scope="col" className="px-6 py-3">
                S.NO
              </th>
              <th scope="col" className="px-6 py-3">
                Student Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          )}
          {tableFor === "sessionDetailsMentor" && (
            <tr>
              <th scope="col" className="px-6 py-3">
                S.NO
              </th>
              <th scope="col" className="px-6 py-3">
                Topic
              </th>
              <th scope="col" className="px-6 py-3">
                Student Name
              </th>
              <th scope="col" className="px-6 py-3">
                Student Email
              </th>
              <th scope="col" className="px-6 py-3">
                Student Joined
              </th>
              <th scope="col" className="px-6 py-3">
                Session Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          )}
          {tableFor === "sessionDeatilsStudent" && (
            <tr>
              <th scope="col" className="px-6 py-3">
                S.NO
              </th>
              <th scope="col" className="px-6 py-3">
                Topic
              </th>
              <th scope="col" className="px-6 py-3">
                Mentor Name
              </th>
              <th scope="col" className="px-6 py-3">
                Mentor Email
              </th>
              <th scope="col" className="px-6 py-3">
                Joined
              </th>
              <th scope="col" className="px-6 py-3">
                Session Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          )}
        </thead>
        <tbody>
          {tableFor === "studentsDetails" &&
            data &&
            data.map((student: any, index: number) => (
              <tr
                key={student.id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <button
                    className="bg-green-500 hover:bg-green-900 text-white"
                    onClick={() => openModal(student)}
                  >
                    Create Session
                  </button>
                </td>
              </tr>
            ))}

          {tableFor === "sessionDetailsMentor" &&
            data &&
            data.map((session: any, index: number) => (
              <tr
                key={session.id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td>{index + 1}</td>
                <td>{session.topic}</td>
                <td>{session.student_name}</td>
                <td>{session.student_email}</td>
                <td
                  className={
                    session.student_joined ? "text-green-300" : "text-red-400"
                  }
                >
                  {session.student_joined ? "Yes" : "No"}
                </td>
                <td className="uppercase">
                  <span
                    className={
                      session.status === "active"
                        ? "text-green-300"
                        : "text-red-400"
                    }
                  >
                    {session.status}
                  </span>
                </td>
                <td>
                  {session.status === "active" && (
                    <>
                      <button
                        onClick={() => handleSessionEnding(session.id)}
                        className="bg-red-500  hover:bg-red-700"
                        disabled={processingId === session.id}
                      >
                        {processingId === session.id
                          ? "Processing.."
                          : buttonText || "End Session"}
                      </button>
                      <Link href={`/dashboard/editor/${session.id}`}>
                        <button
                          style={{ marginLeft: "4px" }}
                          className="bg-green-500 hover:bg-green-900 text-white"
                        >
                          Join Session
                        </button>
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          {tableFor === "sessionDeatilsStudent" &&
            data &&
            data.map((session: any, index: number) => (
              <tr
                key={session.id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td>{index + 1}</td>
                <td>{session.topic}</td>
                <td>{session.mentor_name}</td>
                <td>{session.mentor_email}</td>
                <td
                  className={
                    session.student_joined ? "text-green-300" : "text-red-400"
                  }
                >
                  {session.student_joined ? "Yes" : "No"}
                </td>
                <td className="uppercase">
                  <span
                    className={
                      session.status === "active"
                        ? "text-green-300"
                        : "text-red-400"
                    }
                  >
                    {session.status}
                  </span>
                </td>
                <td>
                  {session.status === "active" && !session.student_joined && (
                    <button
                      onClick={() => handleSessionJoining(session.id)}
                      className="bg-green-500  hover:bg-green-700"
                      disabled={processingId === session.id}
                    >
                      {processingId === session.id
                        ? "Processing.."
                        : buttonText || "Join Session"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/*  Modal */}
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2 className="font-bold text-green-500 text-2xl text-center">
              Create Session
            </h2>
            <p>
              Student Name:{" "}
              <strong className="text-red-400">{selectedStudent?.name}</strong>
            </p>

            <form onSubmit={handleSessionCreation}>
              <input
                onChange={(event) => setSessionTopic(event.target.value)}
                type="text"
                placeholder="Session Topic"
                required
              />
              <p
                className={`${messageType === "error" ? "error__message" : "sucess__message"}`}
              >
                {userMessage}
              </p>
              <div className="modalActions">
                <button
                  type="submit"
                  className="bg-green-800 hover:bg-gray-500 cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="bg-red-800 hover:bg-red-500 cursor-pointer"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsTable;
