import React, { useContext, useState } from "react";
import CreateNotes from "../components/CreateNotes";
import GetNotes from "../components/GetNotes";
import { userContext } from "../context/userContext/userContext";

const Home = () => {
  const [showCreateNotes, setshowCreateNotes] = useState(false);
  const [showGetNotes, setshowGetNotes] = useState(true);
  const { user } = useContext(userContext);

  const handleCreateNotesClick = () => {
    setshowCreateNotes(true);
    setshowGetNotes(false);
  };

  return (
    <>
      {user ? (
        <>
          {" "}
          <div className="my-5 container">
            <button
              className="btn btn-primary ms-3"
              onClick={handleCreateNotesClick}
            >
              Create Notes
            </button>
          </div>
          {showCreateNotes && (
            <CreateNotes
              setshowCreateNotes={setshowCreateNotes}
              setshowGetNotes={setshowGetNotes}
            />
          )}
          {showGetNotes && <GetNotes />}
        </>
      ) : (
        <div className="container mt-5 ms-5 text-secondary">
        <h1>
          You are not a authenticate user so first login or register then you
          are access notes
        </h1>
        </div>
      )}
    </>
  );
};

export default Home;
