// ViewReports.jsx
import { useState } from "react";
import { useBLO } from "./BLOContext";
import NavBar from "./NavBar";
import "./ViewReports.css";

function ViewReports() {
  const { bloList, addFeedback } = useBLO();
  const [regionFilter, setRegionFilter] = useState("");
  const [partyFilter, setPartyFilter] = useState("");
  const [viewMode, setViewMode] = useState("all"); // "all" or "winning"

  // Calculate regional party support
  const regionalPartySupport = {};
  bloList.forEach(item => {
    if (item.region && item.feedback) {
      if (!regionalPartySupport[item.region]) {
        regionalPartySupport[item.region] = {};
      }
      item.feedback.forEach(fb => {
        if (!regionalPartySupport[item.region][fb.party]) {
          regionalPartySupport[item.region][fb.party] = {
            supporters: 0,
            feedbacks: [],
            blos: []
          };
        }
        regionalPartySupport[item.region][fb.party].supporters += parseInt(fb.supporters);
        regionalPartySupport[item.region][fb.party].feedbacks.push({
          feedback: fb.feedback,
          sentiment: fb.sentiment,
          supporters: fb.supporters
        });
        if (!regionalPartySupport[item.region][fb.party].blos.includes(item.name)) {
          regionalPartySupport[item.region][fb.party].blos.push(item.name);
        }
      });
    }
  });

  // Get leading party for each region
  const getLeadingParty = (region) => {
    const parties = regionalPartySupport[region];
    let maxSupport = 0;
    let leadingParty = "";
    Object.entries(parties).forEach(([party, data]) => {
      if (data.supporters > maxSupport) {
        maxSupport = data.supporters;
        leadingParty = party;
      }
    });
    return { party: leadingParty, supporters: maxSupport };
  };

  // Get overall leading party across all regions
  const getOverallLeadingParty = () => {
    const totalSupport = {};
    Object.values(regionalPartySupport).forEach(region => {
      Object.entries(region).forEach(([party, data]) => {
        if (!totalSupport[party]) {
          totalSupport[party] = 0;
        }
        totalSupport[party] += data.supporters;
      });
    });
    let maxSupport = 0;
    let leadingParty = "";
    Object.entries(totalSupport).forEach(([party, supporters]) => {
      if (supporters > maxSupport) {
        maxSupport = supporters;
        leadingParty = party;
      }
    });
    return { party: leadingParty, supporters: maxSupport, allParties: totalSupport };
  };

  const filteredRegions = regionFilter 
    ? [regionFilter] 
    : Object.keys(regionalPartySupport);

  const overallLeading = Object.keys(regionalPartySupport).length > 0 ? getOverallLeadingParty() : null;

  return (
    <div className="view-reports-page">
      <NavBar />
      <div className="view-reports">
        <h3>Regional Party Support & Voter Feedback</h3>

        {Object.keys(regionalPartySupport).length === 0 ? (
          <div className="no-data">
            <p>No feedback data available. Please add voter feedback first.</p>
          </div>
        ) : (
          <>
            {/* Overall Leading Party */}
            {overallLeading && (
              <div className="overall-leading">
                <h2>🏆 Overall Leading Party Across All Regions</h2>
                <div className="overall-winner">
                  <span className="winner-party">{overallLeading.party}</span>
                  <span className="winner-count">{overallLeading.supporters} Total Supporters</span>
                </div>
                <div className="all-parties-summary">
                  {Object.entries(overallLeading.allParties)
                    .sort((a, b) => b[1] - a[1])
                    .map(([party, supporters]) => (
                      <div key={party} className="party-summary-item">
                        <span className="party-name">{party}:</span>
                        <span className="party-supporters">{supporters} supporters</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div className="filters">
              <select 
                className="filter-select" 
                value={regionFilter} 
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="">All Regions</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North">North</option>
                <option value="South">South</option>
              </select>

              <select 
                className="filter-select" 
                value={partyFilter} 
                onChange={(e) => setPartyFilter(e.target.value)}
              >
                <option value="">All Parties</option>
                <option value="Party A">Party A</option>
                <option value="Party B">Party B</option>
                <option value="Party C">Party C</option>
                <option value="Party D">Party D</option>
              </select>

              <select 
                className="filter-select" 
                value={viewMode} 
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="all">Show All Parties</option>
                <option value="winning">Show Winning Party Only</option>
              </select>
            </div>

            {filteredRegions.map((region, regionIdx) => {
              const leading = getLeadingParty(region);
              const partiesToShow = viewMode === "winning" 
                ? [leading.party]
                : Object.keys(regionalPartySupport[region]).filter(party => !partyFilter || party === partyFilter);
              
              return (
                <div key={regionIdx} className="region-section">
                  <h2 className="region-title">{region} Region</h2>
                  <div className="leading-party">
                    <strong>{viewMode === "winning" ? "Winning Party:" : "Leading Party:"}</strong> {leading.party} with {leading.supporters} supporters
                  </div>
                  
                  <div className="party-grid">
                    {partiesToShow.map((party, partyIdx) => {
                        const data = regionalPartySupport[region][party];
                        return (
                          <div key={partyIdx} className="party-support-card">
                            <div className="party-header">
                              <h3>{party}</h3>
                              <div className="supporters-count">{data.supporters} Supporters</div>
                            </div>

                            <div className="blo-attendance">
                              <strong>BLOs Attended:</strong>
                              <div className="blo-tags">
                                {data.blos.map((bloName, bloIdx) => (
                                  <span key={bloIdx} className="blo-tag">{bloName}</span>
                                ))}
                              </div>
                            </div>

                            <div className="voter-feedbacks">
                              <strong>Voter Feedback:</strong>
                              {data.feedbacks.map((fb, fbIdx) => (
                                <div key={fbIdx} className="feedback-item">
                                  <div className="feedback-header">
                                    <span className={`sentiment ${fb.sentiment.toLowerCase()}`}>
                                      {fb.sentiment}
                                    </span>
                                    <span className="feedback-supporters">{fb.supporters} voters</span>
                                  </div>
                                  <p className="feedback-text">{fb.feedback}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default ViewReports;
