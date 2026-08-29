{/* Submit Request Modal */}
      {showRequestModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "540px", boxShadow: "0 20px 25px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: "18px" }}>Submit Comprehensive Requisition</h3>
              <button onClick={() => setShowRequestModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateRequest}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Request Category / Type</label>
                <select value={reqType} onChange={(e) => setReqType(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}>
                  <option value="Leave">Leave Requisition</option>
                  <option value="Expense">Expense Claim / Reimbursement</option>
                  <option value="Purchase">Purchase Order / Procurement</option>
                  <option value="Asset">Asset Allocation / IT Equipment</option>
                </select>
              </div>

              {reqType === "Leave" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Leave Type</label>
                      <select value={leaveCat} onChange={(e) => setLeaveCat(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}>
                        <option value="Casual">Casual Leave</option>
                        <option value="Annual">Annual Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Official Duty">Official Field Duty</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Delegated Person (In Absence)</label>
                      <select value={delegatedPerson} onChange={(e) => setDelegatedPerson(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}>
                        <option value="">Select Colleague</option>
                        {profiles.filter(p => p.email !== sessionUser?.email).map(p => (
                          <option key={p.id} value={p.name}>{p.name} ({p.designation})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Start Date</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13px" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>End Date</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13px" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Total Days</label>
                      <input type="number" value={daysCount} onChange={(e) => setDaysCount(Number(e.target.value))} min={1} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "13px" }} />
                    </div>
                  </div>
                </>
              )}

              {(reqType === "Expense" || reqType === "Purchase") && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Expense / Grant Category</label>
                    <select value={expenseCat} onChange={(e) => setExpenseCat(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}>
                      <option value="Travel & Per Diem">Travel & Per Diem</option>
                      <option value="Legal Camp Logistics">Legal Camp Logistics</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Emergency Relief">Emergency Relief</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Amount Requested (PKR)</label>
                    <input type="number" value={amountVal} onChange={(e) => setAmountVal(Number(e.target.value))} required placeholder="e.g. 25000" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" }} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Detailed Justification / Purpose</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Provide complete background, breakdown, or reasons for audit compliance..." style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowRequestModal(false)} style={{ padding: "10px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: "#334155" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 20px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Submit Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}
