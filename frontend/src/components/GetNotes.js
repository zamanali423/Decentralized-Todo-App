import React, { useContext, useEffect, useState } from "react";
import { useWeb3 } from "../web3 integrate/Web3Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import UpdateNotes from "./UpdateNotes";
import { toast } from "react-toastify";
import { userContext } from "../context/userContext/userContext";

const GetNotes = () => {
  const { web3, account } = useWeb3();
  const {user}=useContext(userContext)
  const [userNotes, setUserNotes] = useState([]);
  const [inputFields, setInputFields] = useState({
    id: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });

  const expiredToken = async (response) => {
    const data = await response.json();
    if (data.msg === "Token Expired. Please log in again.") {
      // Handle token expiration
    } else {
      console.error("Unauthorized access");
    }
  };

  const getNotes = async () => {
    if (!user) {
      console.error("user not available");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 401) {
        expiredToken(response);
      } else if (response.status === 404) {
        console.log("Items Not Found");
        setUserNotes([]);
      } else if (response.ok) {
        const notes = await response.json();
        setUserNotes(notes);
        console.log("Fetched notes:", notes);
      } else {
        console.error("Error fetching Notes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching Notes:", error);
    }
  };

  const handleUpdate = (notes) => () => {
    if (!notes || !notes._id) {
      console.error("Invalid note data");
      return;
    }
    setInputFields({
      id: notes._id,
      title: notes.title,
      content: notes.content,
      updatedAt: notes.updatedAt ? new Date(notes.updatedAt) : "",
    });
  };

  const deleteNotes = async (notes) => {
    if (!user) {
      console.error("user not available");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/items/deleteItem/${notes._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 401) {
        expiredToken(response);
      } else {
        const deletedNotes = await response.json();
        setUserNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== notes._id)
        );
        toast.success(deletedNotes.msg);
      }
    } catch (error) {
      console.error("Error deleting Notes:", error);
    }
  };

  useEffect(() => {
    getNotes();
  }, [account]);

  return (
    <>
      <div className="container">
        <h2>Notes List</h2>
        <table className="task-table">
          <thead>
            <tr>
              <th>Note #</th>
              <th>Title</th>
              <th>Content</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userNotes &&
              userNotes.map((note, index) => (
                <tr key={note._id}>
                  <td>{index + 1}</td>
                  <td>{note.title}</td>
                  <td>{note.content.slice(0, 10)}...</td>
                  <td>
                    {note.createdAt
                      ? new Date(note.createdAt).toISOString().slice(0, 19)
                      : ""}
                  </td>
                  <td>
                    {note.updatedAt
                      ? new Date(note.updatedAt).toISOString().slice(0, 19)
                      : ""}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      className="ms-2 icon"
                      icon={faPenSquare}
                      onClick={handleUpdate(note)}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    />
                    <FontAwesomeIcon
                      className="ms-3 icon"
                      icon={faTrashAlt}
                      onClick={() => deleteNotes(note)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Notes
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <UpdateNotes
                inputFields={inputFields}
                setInputFields={setInputFields}
                setUserNotes={setUserNotes}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetNotes;
