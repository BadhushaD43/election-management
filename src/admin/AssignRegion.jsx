// AssignRegion.jsx
import { useState } from "react";
import { useBLO } from "./BLOContext";
import NavBar from "./NavBar";
import "./AssignRegion.css";

function AssignRegion() {
  const { bloList, assignRegion, deleteBLO } = useBLO();
  const [blo, setBlo] = useState("");
  const [region, setRegion] = useState("");
  const [file, setFile] = useState(null);

  const assign = () => {
    if (!blo || !region) {
      alert("Please fill all fields");
      return;
    }
    assignRegion(blo, region);
    alert(`Assigned ${blo} to ${region}`);
    setBlo("");
    setRegion("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExcelUpload = () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').slice(1); // Skip header
      
      let assignedCount = 0;
      rows.forEach(row => {
        const [bloName, region] = row.split(',').map(item => item.trim());
        if (bloName && region) {
          const bloExists = bloList.find(b => b.name === bloName);
          if (bloExists) {
            assignRegion(bloName, region);
            assignedCount++;
          }
        }
      });
      
      alert(`Assigned ${assignedCount} BLOs from Excel file`);
      setFile(null);
    };
    reader.readAsText(file);
  };

  const handleDelete = (bloName) => {
    if (window.confirm(`Are you sure you want to delete ${bloName}?`)) {
      deleteBLO(bloName);
      alert(`${bloName} has been deleted`);
    }
  };

  return (
    <div className="assign-region">
      <NavBar />
      <div className="assign-content">
        <h3>Assign Region to BDA</h3>
        
        <div className="blo-list-display">
          <h4>Created BDA List</h4>
          <div className="blo-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Region</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bloList.map((bloItem, idx) => (
                  <tr key={idx}>
                    <td>{bloItem.name}</td>
                    <td>{bloItem.phone}</td>
                    <td>{bloItem.email}</td>
                    <td>{bloItem.region || "Not Assigned"}</td>
                    <td>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDelete(bloItem.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="excel-section">
          <h4>Excel Bulk Assign</h4>
          <p className="info-text">Upload CSV file with format: BDA Name, Region</p>
          <input 
            type="file" 
            accept=".csv,.txt" 
            onChange={handleFileChange}
            className="file-input"
          />
          {file && <p className="file-name">Selected: {file.name}</p>}
          <button className="primary-button" onClick={handleExcelUpload}>
            Upload & Assign
          </button>
        </div>

        <div className="single-section">
          <h4>Single Assign</h4>
          <select
            className="input-field"
            value={blo}
            onChange={(e) => setBlo(e.target.value)}
          >
            <option value="">Select BDA</option>
            {bloList.map((bloItem, idx) => (
              <option key={idx} value={bloItem.name}>
                {bloItem.name} {bloItem.region && `(${bloItem.region})`}
              </option>
            ))}
          </select>
          
          <select
            className="input-field"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Select Region</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
          
          <button className="primary-button" onClick={assign}>Assign</button>
        </div>
      </div>
    </div>
  );
}

export default AssignRegion;