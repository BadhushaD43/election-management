// CreateBLO.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBLO } from "./BLOContext";
import NavBar from "./NavBar";
import "./CreateBLO.css";

function CreateBLO() {
  const navigate = useNavigate();
  const { addBLO } = useBLO();
  const [blo, setBlo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    age: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlo((prev) => ({ ...prev, [name]: value }));
  };

  const createBlo = () => {
    if (!blo.name || !blo.phone || !blo.email) {
      alert("Please fill required fields: Name, Phone, Email");
      return;
    }
    
    addBLO({
      ...blo,
      region: "",
      dominantParty: "",
      parties: []
    });
    
    alert(`BLO Created: ${blo.name}`);
    setBlo({
      name: "",
      phone: "",
      email: "",
      address: "",
      gender: "",
      age: "",
    });
    navigate("/admin/reports");
  };

  return (
    <div className="create-blo">
      <NavBar />
      <div className="create-content">
        <h3>Create BDA</h3>

        <input
          className="input-field"
          name="name"
          placeholder="Name"
          value={blo.name}
          onChange={handleChange}
        />
        <input
          className="input-field"
          name="phone"
          placeholder="Phone Number"
          value={blo.phone}
          onChange={handleChange}
        />
        <input
          className="input-field"
          name="email"
          placeholder="Email"
          value={blo.email}
          onChange={handleChange}
        />
        <input
          className="input-field"
          name="address"
          placeholder="Address"
          value={blo.address}
          onChange={handleChange}
        />
        <select
          className="input-field"
          name="gender"
          value={blo.gender}
          onChange={handleChange}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          className="input-field"
          name="age"
          placeholder="Age"
          type="number"
          value={blo.age}
          onChange={handleChange}
        />
        <button className="primary-button" onClick={createBlo}>Create</button>
      </div>
    </div>
  );
}

export default CreateBLO;