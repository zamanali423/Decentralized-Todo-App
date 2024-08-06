import React, { useContext, useState } from "react";
import { userContext } from "../context/userContext/userContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Notes = ({ setshowCreateNotes, setshowGetNotes }) => {
  const { user, logout } = useContext(userContext);
  const navigate = useNavigate();
  const [inputFields, setinputFields] = useState({
    title: "",
    content: "",
    createdAt: "",
    updatedAt: "",
    owner: "",
  });

  const handleInput = (e) => {
    setinputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("User not available");
      return;
    }
    const { email } = user;
    try {
      const response = await fetch(
        "http://localhost:3001/items/createItems/newItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...inputFields,
            title: inputFields.title,
            content: inputFields.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            owner: email,
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
        const items = await response.json();
        console.log(items);
        toast.success(items.msg);
        setinputFields({
          title: "",
          content: "",
          createdAt: "",
          updatedAt: "",
        });
        setshowCreateNotes(false);
        setshowGetNotes(true);
      }
    } catch (error) {
      console.error("Error creating items:", error);
    }
  };

  return (
    <div className="mainForm2">
      <div className="container2">
        <form className="task-form" onSubmit={handleSubmit}>
          <h2>Create a Note</h2>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={inputFields.title}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Content</label>
            <textarea
              id="description"
              name="content"
              value={inputFields.content}
              onChange={handleInput}
              required
            ></textarea>
          </div>
          <button className="button" type="submit">
            Create Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notes;
