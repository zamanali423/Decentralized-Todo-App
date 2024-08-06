import React, { useContext } from "react";
import { userContext } from "../context/userContext/userContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const UpdateNotes = ({ inputFields, setInputFields, setUserNotes }) => {
  const { user, logout } = useContext(userContext);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("User not available");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/items/updateItem/${inputFields.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: inputFields.title,
            content: inputFields.content,
            updatedAt: new Date(),
          }),
        }
      );

      if (response.status === 401) {
        const data = await response.json();
        if (data.msg === "Token Expired. Please log in again.") {
          logout();
          navigate("/login");
        } else {
          console.error("Unauthorized access");
        }
      } else {
        const updateNotes = await response.json();
        console.log("update", updateNotes.item);
        setUserNotes((prevNotes) =>
          prevNotes.map((notes) =>
            notes._id === updateNotes.item._id ? updateNotes.item : notes
          )
        );
        toast.success(updateNotes.msg);
        // Close the modal after successful update
        document.querySelector("#exampleModal .btn-close").click();
      }
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={inputFields.title}
          onChange={handleInput}
          required
        />

        <label htmlFor="description">Content:</label>
        <textarea
          id="description"
          name="content"
          value={inputFields.content}
          onChange={handleInput}
          required
        ></textarea>

        <button type="submit">Update Note</button>
      </form>
    </>
  );
};

export default UpdateNotes;
